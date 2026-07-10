const user = requireAuth();
let recordModal;

if (user) {
  initTopbar(user);
  highlightActiveNav();
  recordModal = new bootstrap.Modal(document.getElementById("recordModal"));

  loadDropdowns();

  document.getElementById("patientSelect").addEventListener("change", (e) => {
    loadRecords(e.target.value);
  });

  document.getElementById("recordForm").addEventListener("submit", handleSubmit);
}

async function loadDropdowns() {
  try {
    const patients = await apiRequest("/patients");
    const patientSelect = document.getElementById("patientSelect");
    patients.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      patientSelect.appendChild(opt);
    });

    const appointments = await apiRequest("/appointments");
    const apptSelect = document.getElementById("recordAppointment");
    appointments.forEach((a) => {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = `${a.patientName} with ${a.doctorName} - ${new Date(a.appointmentDateTime).toLocaleString()}`;
      apptSelect.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadRecords(patientId) {
  const tbody = document.getElementById("recordsTableBody");
  if (!patientId) {
    tbody.innerHTML = `<tr><td colspan="4">Select a patient to view medical records.</td></tr>`;
    return;
  }
  try {
    const records = await apiRequest(`/medical-records/${patientId}`);
    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4">No medical records for this patient yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = records.map((r) => `
      <tr>
        <td>${r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</td>
        <td>${escapeHtml(r.diagnosis || "-")}</td>
        <td>${escapeHtml(r.prescription || "-")}</td>
        <td>${escapeHtml(r.notes || "-")}</td>
      </tr>
    `).join("");
  } catch (err) {
    document.getElementById("errorBox").textContent = err.message;
    document.getElementById("errorBox").classList.remove("d-none");
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const payload = {
    appointmentId: Number(document.getElementById("recordAppointment").value),
    diagnosis: document.getElementById("recordDiagnosis").value,
    prescription: document.getElementById("recordPrescription").value,
    notes: document.getElementById("recordNotes").value,
  };

  try {
    await apiRequest("/medical-records", { method: "POST", body: payload });
    recordModal.hide();
    document.getElementById("recordForm").reset();
    const patientId = document.getElementById("patientSelect").value;
    if (patientId) loadRecords(patientId);
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
