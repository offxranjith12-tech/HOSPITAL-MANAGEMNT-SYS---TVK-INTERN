const user = requireAuth();
let patientModal;

if (user) {
  initTopbar(user);
  highlightActiveNav();
  patientModal = new bootstrap.Modal(document.getElementById("patientModal"));

  loadPatients();

  document.getElementById("addPatientBtn").addEventListener("click", () => {
    document.getElementById("patientForm").reset();
    document.getElementById("patientId").value = "";
    document.getElementById("patientModalTitle").textContent = "Register Patient";
    document.getElementById("modalErrorBox").classList.add("d-none");
  });

  document.getElementById("patientForm").addEventListener("submit", handleSubmit);
}

async function loadPatients() {
  const tbody = document.getElementById("patientsTableBody");
  try {
    const patients = await apiRequest("/patients");
    if (patients.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">No patients found.</td></tr>`;
      return;
    }
    tbody.innerHTML = patients.map((p) => `
      <tr>
        <td>${escapeHtml(p.name)}</td>
        <td>${p.dateOfBirth || "-"}</td>
        <td>${escapeHtml(p.gender || "-")}</td>
        <td>${escapeHtml(p.phone || "-")}</td>
        <td>${escapeHtml(p.email || "-")}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editPatient(${p.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deletePatient(${p.id})">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    document.getElementById("errorBox").textContent = err.message;
    document.getElementById("errorBox").classList.remove("d-none");
  }
}

async function editPatient(id) {
  try {
    const p = await apiRequest(`/patients/${id}`);
    document.getElementById("patientId").value = p.id;
    document.getElementById("patientName").value = p.name;
    document.getElementById("patientDob").value = p.dateOfBirth || "";
    document.getElementById("patientGender").value = p.gender || "";
    document.getElementById("patientPhone").value = p.phone || "";
    document.getElementById("patientEmail").value = p.email || "";
    document.getElementById("patientAddress").value = p.address || "";
    document.getElementById("patientModalTitle").textContent = "Edit Patient";
    document.getElementById("modalErrorBox").classList.add("d-none");
    patientModal.show();
  } catch (err) {
    alert(err.message);
  }
}

async function deletePatient(id) {
  if (!confirm("Delete this patient?")) return;
  try {
    await apiRequest(`/patients/${id}`, { method: "DELETE" });
    loadPatients();
  } catch (err) {
    alert(err.message);
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("patientId").value;
  const payload = {
    name: document.getElementById("patientName").value,
    dateOfBirth: document.getElementById("patientDob").value || null,
    gender: document.getElementById("patientGender").value,
    phone: document.getElementById("patientPhone").value,
    email: document.getElementById("patientEmail").value,
    address: document.getElementById("patientAddress").value,
  };

  try {
    if (id) {
      await apiRequest(`/patients/${id}`, { method: "PUT", body: payload });
    } else {
      await apiRequest("/patients", { method: "POST", body: payload });
    }
    patientModal.hide();
    loadPatients();
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
