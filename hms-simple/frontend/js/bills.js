const user = requireAuth();
let billModal;

if (user) {
  initTopbar(user);
  highlightActiveNav();
  billModal = new bootstrap.Modal(document.getElementById("billModal"));

  loadPatientDropdowns();

  document.getElementById("patientSelect").addEventListener("change", (e) => {
    loadBills(e.target.value);
  });

  document.getElementById("addBillBtn").addEventListener("click", () => {
    const selected = document.getElementById("patientSelect").value;
    document.getElementById("billForm").reset();
    document.getElementById("billPatient").value = selected || "";
    document.getElementById("modalErrorBox").classList.add("d-none");
  });

  document.getElementById("billForm").addEventListener("submit", handleSubmit);
}

async function loadPatientDropdowns() {
  try {
    const patients = await apiRequest("/patients");
    ["patientSelect", "billPatient"].forEach((id) => {
      const select = document.getElementById(id);
      patients.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        select.appendChild(opt);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadBills(patientId) {
  const tbody = document.getElementById("billsTableBody");
  if (!patientId) {
    tbody.innerHTML = `<tr><td colspan="4">Select a patient to view bills.</td></tr>`;
    return;
  }
  try {
    const bills = await apiRequest(`/bills/${patientId}`);
    if (bills.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4">No bills for this patient yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = bills.map((b) => `
      <tr>
        <td>${b.billDate ? new Date(b.billDate).toLocaleString() : "-"}</td>
        <td>$${Number(b.amount).toFixed(2)}</td>
        <td>${escapeHtml(b.description || "-")}</td>
        <td><span class="badge ${badgeClass(b.status)}">${b.status}</span></td>
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
    patientId: Number(document.getElementById("billPatient").value),
    amount: Number(document.getElementById("billAmount").value),
    description: document.getElementById("billDescription").value,
    status: document.getElementById("billStatus").value,
  };

  try {
    await apiRequest("/bills", { method: "POST", body: payload });
    billModal.hide();
    const patientId = document.getElementById("patientSelect").value;
    if (patientId) loadBills(patientId);
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
