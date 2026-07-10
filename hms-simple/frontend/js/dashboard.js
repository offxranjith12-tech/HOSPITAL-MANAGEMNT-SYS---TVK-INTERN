const user = requireAuth();
if (user) {
  initTopbar(user);
  highlightActiveNav();

  (async () => {
    try {
      const [doctors, patients, appointments] = await Promise.all([
        apiRequest("/doctors"),
        apiRequest("/patients"),
        apiRequest("/appointments"),
      ]);
      document.getElementById("statDoctors").textContent = doctors.length;
      document.getElementById("statPatients").textContent = patients.length;
      document.getElementById("statAppointments").textContent = appointments.length;
    } catch (err) {
      console.error(err);
    }
  })();
}
