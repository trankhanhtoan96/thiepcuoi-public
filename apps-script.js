// ============================================================
// GOOGLE APPS SCRIPT — Paste vào Extensions → Apps Script
// Deploy: Web App → Execute as Me → Anyone can access
// ============================================================

var SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
var SHEET_NAME = 'Sheet1';
var PASSERBY_SHEET_NAME = 'Sheet2';

// Column indexes (0-based): STT=0, ID=1, Tên gọi=2, Số điện thoại=3, Ghi chú=4, Tham dự nhóm họ=5, Tham dự tiệc cưới=6, Lời chúc=7, Số tiền mừng cưới=8, Thời gian=9, K=10, Số người=11
var COL = { STT: 0, ID: 1, NAME: 2, PHONE: 3, NOTE: 4, ATTEND_FAMILY: 5, ATTEND_WEDDING: 6, WISH: 7, GIFT: 8, TIME: 9, NUM_GUESTS: 11 };

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    let result;

    switch (data.action) {
      case 'submitWish':
        result = submitWish(data);
        break;
      case 'submitRSVP':
        result = submitRSVP(data);
        break;
      default:
        result = { error: 'Unknown action' };
    }
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function findRowById(sheet, id) {
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][COL.ID]) === String(id)) return i + 1; // 1-based row number
  }
  return null;
}

function submitWish(data) {
  // Passerby wish (no guest ID) — append to separate sheet
  if (!data.id) {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(PASSERBY_SHEET_NAME);
    var nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1).setValue(data.name || 'Ẩn danh');  // Column A: Name
    sheet.getRange(nextRow, 2).setValue(data.message || '');       // Column B: Wish
    sheet.getRange(nextRow, 3).setValue(new Date());               // Column C: Timestamp
    return { success: true };
  }

  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  var rowNum = findRowById(sheet, data.id);

  // ID not found in Sheet1 — treat as passerby, write to Sheet2
  if (!rowNum) {
    var passerbySheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(PASSERBY_SHEET_NAME);
    var nextRow = passerbySheet.getLastRow() + 1;
    passerbySheet.getRange(nextRow, 1).setValue(data.name || 'Ẩn danh');
    passerbySheet.getRange(nextRow, 2).setValue(data.message || '');
    passerbySheet.getRange(nextRow, 3).setValue(new Date());
    return { success: true };
  }

  // Write wish to column H (Lời chúc) and timestamp to column J (Thời gian)
  sheet.getRange(rowNum, COL.WISH + 1).setValue(data.message || '');
  sheet.getRange(rowNum, COL.TIME + 1).setValue(new Date());
  return { success: true };
}

function submitRSVP(data) {
  if (!data.id) return { success: false, error: 'no_id' };

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const rowNum = findRowById(sheet, data.id);
  if (!rowNum) return { success: false, error: 'not_found' };

  // Update attendance columns
  if (data.attend_family !== undefined) {
    sheet.getRange(rowNum, COL.ATTEND_FAMILY + 1).setValue(data.attend_family ? 'TRUE' : 'FALSE');
  }
  if (data.attend_wedding !== undefined) {
    sheet.getRange(rowNum, COL.ATTEND_WEDDING + 1).setValue(data.attend_wedding ? 'TRUE' : 'FALSE');
  }
  if (data.message) {
    sheet.getRange(rowNum, COL.WISH + 1).setValue(data.message);
  }
  if (data.num_guests) {
    sheet.getRange(rowNum, COL.NUM_GUESTS + 1).setValue(data.num_guests);
  }

  return { success: true };
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}