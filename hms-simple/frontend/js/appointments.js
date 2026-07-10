const user = requireAuth();
let appointmentModal;

if (user) {
  initTopbar(user);
  highlightActiveNav();
  appointmentModal = new bootstrap.Modal(document.getElementById("appointmentModal"));

  loadDropdowns();
  loadAppointments();

  document.getElementById("addAppointmentBtn").addEventListener("click", () => {
    document.getElementById("appointmentForm").reset();
    document.getElementById("modalErrorBox").classList.add("d-none");
  });

  document.getElementById("appointmentForm").addEventListener("submit", handleSubmit);
}

async function loadDropdowns() {
  try {
    const [doctors, patients] = await Promise.all([apiRequest("/doctors"), apiRequest("/patients")]);
    const doctorSelect = document.getElementById("appointmentDoctor");
    doctors.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${d.name} (${d.specialization})`;
      doctorSelect.appendChild(opt);
    });
    const patientSelect = document.getElementById("appointmentPatient");
    patients.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      patientSelect.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadAppointments() {
  const tbody = document.getElementById("appointmentsTableBody");
  try {
    const appointments = await apiRequest("/appointments");
    if (appointments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">No appointments found.</td></tr>`;
      return;
    }
    tbody.innerHTML = appointments.map((a) => `
      <tr>
        <td>${escapeHtml(a.doctorName)}</td>
        <td>${escapeHtml(a.patientName)}</td>
        <td>${a.appointmentDateTime ? new Date(a.appointmentDateTime).toLocaleString() : "-"}</td>
        <td><span class="badge ${badgeClass(a.status)}">${a.status}</span></td>
        <td>${escapeHtml(a.reason || "-")}</td>
        <td>
          ${a.status === "SCHEDULED" ? `
            <button class="btn btn-secondary btn-sm" onclick="completeAppointment(${a.id})">Complete</button>
            <button class="btn btn-danger btn-sm" onclick="cancelAppointment(${a.id})">Cancel</button>
          ` : ""}
        </td>
      </tr>
    `).join("");
  } catch (err) {
    document.getElementById("errorBox").textContent = err.message;
    document.getElementById("errorBox").classList.remove("d-none");
  }
}

async function completeAppointment(id) {
  try {
    await apiRequest(`/appointments/${id}`, { method: "PUT", body: { status: "COMPLETED" } });
    loadAppointments();
  } catch (err) {
    alert(err.message);
  }
}

async function cancelAppointment(id) {
  if (!confirm("Cancel this appointment?")) return;
  try {
    await apiRequest(`/appointments/${id}`, { method: "DELETE" });
    loadAppointments();
  } catch (err) {
    alert(err.message);
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const payload = {
    doctorId: Number(document.getElementById("appointmentDoctor").value),
    patientId: Number(document.getElementById("appointmentPatient").value),
    appointmentDateTime: document.getElementById("appointmentDateTime").value,
    reason: document.getElementById("appointmentReason").value,
  };

  try {
    await apiRequest("/appointments", { method: "POST", body: payload });
    appointmentModal.hide();
    loadAppointments();
  } catch (err) {
    const box = document.getElementById("modalErrorBox");
    box.textContent = err.message;
    box.classList.remove("d-none");
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
