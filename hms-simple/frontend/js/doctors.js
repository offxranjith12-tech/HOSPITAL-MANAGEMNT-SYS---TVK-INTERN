const user = requireAuth();
let doctorModal;

if (user) {
  initTopbar(user);
  highlightActiveNav();
  doctorModal = new bootstrap.Modal(document.getElementById("doctorModal"));

  loadDepartments();
  loadDoctors();

  document.getElementById("addDoctorBtn").addEventListener("click", () => {
    document.getElementById("doctorForm").reset();
    document.getElementById("doctorId").value = "";
    document.getElementById("doctorModalTitle").textContent = "Add Doctor";
    document.getElementById("modalErrorBox").classList.add("d-none");
  });

  document.getElementById("doctorForm").addEventListener("submit", handleSubmit);
}

async function loadDepartments() {
  const select = document.getElementById("doctorDepartment");
  try {
    const departments = await apiRequest("/departments");
    departments.forEach((dep) => {
      const opt = document.createElement("option");
      opt.value = dep.id;
      opt.textContent = dep.name;
      select.appendChild(opt);
    });
  } catch (err) {
    // departments are optional; ignore if endpoint isn't reachable
  }
}

async function loadDoctors() {
  const tbody = document.getElementById("doctorsTableBody");
  try {
    const doctors = await apiRequest("/doctors");
    if (doctors.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">No doctors found.</td></tr>`;
      return;
    }
    tbody.innerHTML = doctors.map((d) => `
      <tr>
        <td>${escapeHtml(d.name)}</td>
        <td>${escapeHtml(d.specialization)}</td>
        <td>${escapeHtml(d.departmentName || "-")}</td>
        <td>${escapeHtml(d.email || "-")}</td>
        <td>${escapeHtml(d.phone || "-")}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editDoctor(${d.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteDoctor(${d.id})">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    document.getElementById("errorBox").textContent = err.message;
    document.getElementById("errorBox").classList.remove("d-none");
  }
}

async function editDoctor(id) {
  try {
    const d = await apiRequest(`/doctors/${id}`);
    document.getElementById("doctorId").value = d.id;
    document.getElementById("doctorName").value = d.name;
    document.getElementById("doctorSpecialization").value = d.specialization;
    document.getElementById("doctorDepartment").value = d.departmentId || "";
    document.getElementById("doctorEmail").value = d.email || "";
    document.getElementById("doctorPhone").value = d.phone || "";
    document.getElementById("doctorModalTitle").textContent = "Edit Doctor";
    document.getElementById("modalErrorBox").classList.add("d-none");
    doctorModal.show();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteDoctor(id) {
  if (!confirm("Delete this doctor?")) return;
  try {
    await apiRequest(`/doctors/${id}`, { method: "DELETE" });
    loadDoctors();
  } catch (err) {
    alert(err.message);
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("doctorId").value;
  const deptVal = document.getElementById("doctorDepartment").value;
  const payload = {
    name: document.getElementById("doctorName").value,
    specialization: document.getElementById("doctorSpecialization").value,
    departmentId: deptVal ? Number(deptVal) : null,
    email: document.getElementById("doctorEmail").value,
    phone: document.getElementById("doctorPhone").value,
  };

  try {
    if (id) {
      await apiRequest(`/doctors/${id}`, { method: "PUT", body: payload });
    } else {
      await apiRequest("/doctors", { method: "POST", body: payload });
    }
    doctorModal.hide();
    loadDoctors();
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
