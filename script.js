// LocalStorage වෙතින් දත්ත ලබා ගැනීම
let staffData = JSON.parse(localStorage.getItem("staffData")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
let adminPassword = "admin"; // මෙතැනින් මුරපදය මාරු කළ හැක

// 1. පැමිණීම සටහන් කිරීම (OT සහිතව)
function markAttendance() {
    let id = prompt("ඔබේ ID අංකය ඇතුළත් කරන්න:");
    let p = staffData.find(x => x.id === id);
    if (p) {
        let now = new Date();
        let hour = now.getHours();
        let otHours = 0;

        // සවස 5 (17) සිට උදේ 8 දක්වා OT ගණනය
        if (hour >= 17) {
            otHours = hour - 17 + 1;
        } else if (hour < 8) {
            otHours = hour + 8;
        }
        
        attendance.push({
            name: p.name, id: p.id,
            date: now.toLocaleDateString(), 
            time: now.toLocaleTimeString(), 
            ot: otHours
        });
        localStorage.setItem("attendance", JSON.stringify(attendance));
        alert(`✅ ${p.name}, පැමිණීම සටහන් විය! (OT පැය: ${otHours})`);
    } else {
        alert("⚠️ ලියාපදිංචි වී නොමැත!");
    }
}

// 2. කළමනාකරුගේ පැනලය
function openAdminPanel() {
    if (prompt("මුරපදය ඇතුළත් කරන්න:") === adminPassword) {
        document.getElementById("adminPanel").style.display = "block";
    } else {
        alert("❌ වැරදි මුරපදයකි!");
    }
}

// 3. කළමනාකරුගේ සියලු ක්‍රියාකාරකම්
function adminAction(action) {
    let area = document.getElementById("displayArea");
    let title = document.getElementById("displayTitle");
    let list = document.getElementById("displayList");
    area.style.display = "block";

    if (action === 'register') {
        let p = { 
            name: prompt("නම:"), id: prompt("ID:"), 
            dailyWage: parseFloat(prompt("දින වැටුප:")), 
            otRate: parseFloat(prompt("OT පැයට අනුපාතය:")) 
        };
        staffData.push(p); localStorage.setItem("staffData", JSON.stringify(staffData));
        alert("✨ ලියාපදිංචි සාර්ථකයි!");
    } 
    else if (action === 'salary') {
        let id = prompt("ID අංකය:"); let p = staffData.find(x => x.id === id);
        if (p) {
            let staffAttendance = attendance.filter(a => a.id === id);
            let totalDays = staffAttendance.length;
            let totalOt = staffAttendance.reduce((sum, a) => sum + a.ot, 0);
            let total = (p.dailyWage * totalDays) + (totalOt * p.otRate);
            
            alert(`👤 ${p.name}\n📅 දින: ${totalDays}\n⏰ OT පැය: ${totalOt}\n💵 මුළු වැටුප: රු.${total.toFixed(2)}`);
        } else alert("❌ ID හමු නොවීය.");
    } 
    else if (action === 'list') {
        title.innerText = "👥 සේවක ලැයිස්තුව";
        list.innerHTML = staffData.map(p => `<li>👤 ${p.name} (ID: ${p.id})</li>`).join('');
    } 
    else if (action === 'attendance') {
        title.innerText = "📊 පැමිණීමේ වාර්තා";
        list.innerHTML = attendance.map(a => `<li>📅 ${a.date} | ${a.name} | OT:${a.ot}h</li>`).join('');
    } 
    // Reset පහසුකම්
    else if (action === 'resetStaff') {
        if (confirm("⚠️ සේවක ලැයිස්තුව මකන්නද?")) { localStorage.removeItem("staffData"); location.reload(); }
    } 
    else if (action === 'resetAttendance') {
        if (confirm("⚠️ පැමිණීමේ වාර්තා මකන්නද?")) { localStorage.removeItem("attendance"); location.reload(); }
    } 
    else if (action === 'resetAll') {
        if (confirm("⚠️ සම්පූර්ණ පද්ධතිය මකන්නද?")) { localStorage.clear(); location.reload(); }
    }
}