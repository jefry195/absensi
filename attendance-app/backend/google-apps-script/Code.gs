/**
 * Absensi Karyawan Berbasis Face Recognition - Google Apps Script REST API
 * Backend REST API Service for Google Sheets Database Integration
 * Spreadsheet ID: 1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4
 */

const SPREADSHEET_ID = "1cJM7tAYKsfeTv7owtIunLIKxmLpSGQ9qqmR18h_Omd4";

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET Handler
function doGet(e) {
  try {
    const action = e.parameter.action || e.parameter.path || "getAttendance";
    const ss = getSpreadsheet();

    if (action === "getSettings" || action === "/settings") {
      const sheetSettings = ss.getSheetByName("Settings") || ss.getSheets()[1];
      const data = sheetSettings.getDataRange().getValues();
      const officeLat = data.length > 1 ? parseFloat(data[1][0]) : -6.2088;
      const officeLng = data.length > 1 ? parseFloat(data[1][1]) : 106.8456;
      const radius = data.length > 1 ? parseInt(data[1][2]) : 100;
      return responseJSON({
        success: true,
        data: { officeLat, officeLng, radius }
      });
    }

    if (action === "getUsers" || action === "/users") {
      const sheetUsers = ss.getSheetByName("Users") || ss.getSheets()[0];
      const rows = sheetUsers.getDataRange().getValues();
      const headers = rows[0];
      const users = [];
      for (let i = 1; i < rows.length; i++) {
        users.push({
          id: rows[i][0],
          nama: rows[i][1],
          nik: rows[i][2],
          email: rows[i][3],
          divisi: rows[i][6],
          role: rows[i][7]
        });
      }
      return responseJSON({ success: true, data: users });
    }

    if (action === "getAttendance" || action === "/attendance") {
      const sheetAtt = ss.getSheetByName("Attendance") || ss.getSheets()[2];
      const rows = sheetAtt.getDataRange().getValues();
      const attendance = [];
      for (let i = 1; i < rows.length; i++) {
        attendance.push({
          id: rows[i][0],
          userId: rows[i][1],
          nama: rows[i][2],
          tanggal: rows[i][3],
          jam: rows[i][4],
          checkType: rows[i][5],
          latitude: rows[i][6],
          longitude: rows[i][7],
          distance: rows[i][8],
          similarity: rows[i][9],
          selfieUrl: rows[i][10],
          status: rows[i][11]
        });
      }
      return responseJSON({ success: true, data: attendance });
    }

    return responseJSON({ success: false, message: "Action GET tidak valid" });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  }
}

// POST Handler
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }
    const action = payload.action || e.parameter.action || "";
    const ss = getSpreadsheet();

    if (action === "login" || action === "/login") {
      const sheetUsers = ss.getSheetByName("Users") || ss.getSheets()[0];
      const rows = sheetUsers.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][3] === payload.email) { // Email match
          return responseJSON({
            success: true,
            user: {
              id: rows[i][0],
              nama: rows[i][1],
              nik: rows[i][2],
              email: rows[i][3],
              divisi: rows[i][6],
              role: rows[i][7]
            }
          });
        }
      }
      return responseJSON({ success: false, message: "Email atau password tidak cocok" });
    }

    if (action === "register" || action === "/register") {
      const sheetUsers = ss.getSheetByName("Users") || ss.getSheets()[0];
      const newId = "USR-" + (sheetUsers.getLastRow() + 1000);
      sheetUsers.appendRow([
        newId,
        payload.nama || "User Baru",
        payload.nik || "-",
        payload.email || "",
        payload.password || "",
        JSON.stringify(payload.faceEmbedding || []),
        payload.divisi || "General",
        payload.role || "karyawan"
      ]);
      return responseJSON({ success: true, message: "Pendaftaran user berhasil", userId: newId });
    }

    if (action === "checkin" || action === "checkout" || action === "/checkin" || action === "/checkout") {
      const sheetAtt = ss.getSheetByName("Attendance") || ss.getSheets()[2];
      const recId = "ATT-" + new Date().getTime();
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toLocaleTimeString();

      sheetAtt.appendRow([
        recId,
        payload.userId || "EMP-8026",
        payload.nama || "Alex Vance",
        payload.tanggal || dateStr,
        payload.jam || timeStr,
        action.includes("in") ? "IN" : "OUT",
        payload.latitude || -6.2088,
        payload.longitude || 106.8456,
        payload.distance || 0,
        payload.similarity || 0.98,
        payload.selfieUrl || "",
        payload.status || "Present"
      ]);

      return responseJSON({
        success: true,
        message: `Absensi ${action.includes("in") ? "Masuk" : "Keluar"} berhasil disimpan`,
        recordId: recId
      });
    }

    if (action === "update-settings" || action === "/update-settings") {
      const sheetSettings = ss.getSheetByName("Settings") || ss.getSheets()[1];
      sheetSettings.getRange(2, 1).setValue(payload.officeLat || -6.2088);
      sheetSettings.getRange(2, 2).setValue(payload.officeLng || 106.8456);
      sheetSettings.getRange(2, 3).setValue(payload.radius || 100);
      return responseJSON({ success: true, message: "Radius & Lokasi Kantor Berhasil Diperbarui" });
    }

    return responseJSON({ success: false, message: "Action POST tidak valid" });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  }
}
