---
title: Google Apps Script Product Intake Workflow
description: Portfolio artifact documenting a Google Apps Script workflow that turns Google Form product intake responses into Squarespace-ready CSV records.
---

# Google Apps Script Product Intake Workflow

**Project type:** Workflow automation / data organization  
**Tools:** Google Apps Script, JavaScript, Google Forms, Google Sheets, Google Drive, CSV export, Squarespace product import  
**Use case:** Turning structured product-intake responses into cleaner, draft-ready product records for website upload.

## Portfolio Summary

This project automates part of a product-intake workflow for a ceramics website. The workflow starts with a structured Google Form and response Sheet, then uses Google Apps Script to clean product data, format product descriptions, calculate shipping-ready fields, collect public image URLs, and export a Squarespace-compatible CSV file.

The goal was not to build a flashy app. The goal was to reduce repetitive manual entry, improve consistency, and make product information easier to review before upload. Apparently the modern internet requires handcrafted ceramics *and* automated CSV rituals. Here we are.

## Workflow Diagram

![Workflow Automation Diagram](assets/apps_script_workflow_diagram.png)

## Workflow

1. Product details are submitted through a Google Form.
2. Responses are stored in a linked Google Sheet.
3. Apps Script reads the response rows and cleans product fields.
4. The script creates formatted product descriptions and product URL slugs.
5. Photo links are converted into public Google Drive download URLs.
6. The script exports a Squarespace-ready CSV file to Google Drive.
7. The CSV can be reviewed and imported into Squarespace.

## What This Project Demonstrates

| Skill Area | Evidence in the Project |
|---|---|
| Workflow automation | Uses Google Apps Script to create a repeatable form-to-CSV process |
| Data organization | Standardizes product fields like name, category, price, dimensions, weight, status, and notes |
| Spreadsheet logic | Reads response data by header names instead of hard-coded row positions |
| Web publishing support | Produces product records formatted for Squarespace import |
| Data cleaning | Cleans numbers, formats dimensions and weights, creates URL slugs, and escapes HTML |
| File/link handling | Extracts Google Drive file IDs and converts them into public image URLs |
| Documentation | Explains how a non-technical workflow can be made more consistent and reusable |

## Main Functions

| Function | Purpose |
|---|---|
| `createGlazedAndFiredProductIntakeForm()` | Creates the Google Form, links it to a response Sheet, and stores IDs in script properties |
| `addProductBasicsSection_()` | Adds fields for name, category, SKU, price, status, and description |
| `addMeasurementsSection_()` | Adds length, height, depth, and weight fields |
| `addCareAndShippingSection_()` | Adds care-related and shipping-note fields |
| `addPhotosSection_()` | Adds the photo-notes section and instructions for file upload questions |
| `addSquarespaceSection_()` | Adds pre-publish checklist and Squarespace URL field |
| `exportSquarespaceCsvToDrive()` | Reads response data and exports a Squarespace-compatible CSV file |
| `makeDescription_()` | Builds HTML product descriptions from cleaned row data |
| `getPublicImageUrls_()` | Extracts Drive file links and converts them to public image URLs |
| `slugify_()` | Creates URL-friendly product slugs |
| `toCsvLine_()` | Escapes and formats rows for valid CSV output |

## How It Is Used

### Step 1: Create the intake form

Run this function inside Google Apps Script:

```javascript
createGlazedAndFiredProductIntakeForm();
```

This creates:

- A Google Form for product intake
- A linked Google Sheet for responses
- Saved script properties for the form ID and response sheet ID

### Step 2: Submit product entries

Each ceramic piece gets one form response. The form collects product name, category, price, status, dimensions, weight, care details, notes, and photo notes.

The script expects the status field to be used as a publishing control. Rows marked **Ready for website** are included in the export.

### Step 3: Export the Squarespace CSV

After product responses are submitted, run:

```javascript
exportSquarespaceCsvToDrive();
```

This creates a CSV file in Google Drive with Squarespace-compatible columns.

## Important Implementation Notes

- The script reads columns by header name, which makes it more stable if column order changes.
- Product rows without a piece name are skipped.
- Rows are only exported if their status is `Ready for website`.
- Product descriptions are generated as HTML paragraphs.
- Weight is converted from pounds to ounces for display in the product description.
- Shipping dimensions are padded by 1 inch to account for packing.
- Shipping weight is increased by 20 percent to estimate packed weight.
- Google Drive image links are converted into public download links.
- CSV fields are escaped correctly if they contain commas, quotes, or line breaks.

## Limitations and Future Improvements

- File upload questions must be added manually in the Google Form after creation.
- The script assumes specific header names from the form.
- Squarespace import formatting may need adjustment if Squarespace changes its CSV template.
- Future improvements could include stronger validation, automatic status updates after export, and a cleaner dashboard for reviewing ready products.

## Portfolio Blurb

Built a Google Apps Script workflow that turns Google Form product-intake responses into Squarespace-ready CSV records for a ceramics website. The project demonstrates workflow automation, spreadsheet-based data organization, CSV formatting, image-link handling, and documentation for a repeatable publishing process.

## Full Google Apps Script Source Code

```javascript
function createGlazedAndFiredProductIntakeForm() {
  const form = FormApp.create('Glazed & Fired Product Intake');
  form.setDescription(
    'Submit one form per ceramic piece. Add measurements, price, and 4 photos before entering the product into Squarespace.'
  );
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);
  form.setConfirmationMessage('Saved. Submit another piece when ready.');

  const sheet = SpreadsheetApp.create('Glazed & Fired Product Intake Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  PropertiesService.getScriptProperties().setProperty('RESPONSE_SHEET_ID', sheet.getId());
  PropertiesService.getScriptProperties().setProperty('FORM_ID', form.getId());

  addProductBasicsSection_(form);
  addMeasurementsSection_(form);
  addCareAndShippingSection_(form);
  addPhotosSection_(form);
  addSquarespaceSection_(form);

  Logger.log('Form edit link: ' + form.getEditUrl());
  Logger.log('Form share link: ' + form.getPublishedUrl());
  Logger.log('Response sheet: ' + sheet.getUrl());
}

function addProductBasicsSection_(form) {
  form.addSectionHeaderItem().setTitle('Product Basics');

  form.addTextItem()
    .setTitle('Piece name')
    .setHelpText('Example: Goldie, Vivian, Blue Floral Frame')
    .setRequired(true);

  form.addListItem()
    .setTitle('Category')
    .setChoiceValues(['Ladies', 'Frames', 'Magnets', 'Bowls', 'Sculpture', 'Other'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('SKU or tracking code')
    .setHelpText('Optional. Example: GF-2026-001')
    .setRequired(false);

  form.addTextItem()
    .setTitle('Price')
    .setHelpText('Numbers only. Example: 95')
    .setRequired(true);

  form.addListItem()
    .setTitle('Status')
    .setChoiceValues([
      'Ready for website',
      'Uploaded to Squarespace',
      'Hold for show',
      'Sold',
      'Needs photos',
      'Needs measurements',
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Short description')
    .setHelpText('One or two sentences. This can become the Squarespace product description.')
    .setRequired(false);
}

function addMeasurementsSection_(form) {
  form.addPageBreakItem().setTitle('Measurements');

  form.addTextItem()
    .setTitle('Length in inches')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Height in inches')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Depth in inches')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Weight in pounds')
    .setHelpText('Use packed shipping weight if you know it. Otherwise use piece weight and update before publishing.')
    .setRequired(true);
}

function addCareAndShippingSection_(form) {
  form.addPageBreakItem().setTitle('Care and Shipping');

  form.addMultipleChoiceItem()
    .setTitle('Food safe?')
    .setChoiceValues(['Yes', 'No', 'Not sure'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Dishwasher safe?')
    .setChoiceValues(['Yes', 'No', 'Hand wash recommended', 'Not sure'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Microwave safe?')
    .setChoiceValues(['Yes', 'No', 'Not sure'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Notes')
    .setHelpText('Damage, special packing, show hold, customer hold, glaze notes, etc.')
    .setRequired(false);
}

function addPhotosSection_(form) {
  form.addPageBreakItem().setTitle('Photos');

  form.addSectionHeaderItem()
    .setTitle('Photo Uploads')
    .setHelpText('After this form is created, manually add 4 File upload questions here: front, side, back, top.');

  form.addParagraphTextItem()
    .setTitle('Photo notes')
    .setHelpText('Optional: note anything about the photos, filenames, or missing shots.')
    .setRequired(false);
}

function addSquarespaceSection_(form) {
  form.addPageBreakItem().setTitle('Squarespace Publishing');

  form.addCheckboxItem()
    .setTitle('Pre-publish checklist')
    .setChoiceValues([
      'Photos look good',
      'Price is correct',
      'Quantity should be 1',
      'Measurements entered',
      'Weight entered',
      'Ready to add to Squarespace',
    ])
    .setRequired(false);

  form.addTextItem()
    .setTitle('Squarespace product URL')
    .setHelpText('Fill this later after the product is created.')
    .setRequired(false);
}

function exportSquarespaceCsvToDrive() {
  const sheetId = PropertiesService.getScriptProperties().getProperty('RESPONSE_SHEET_ID');
  if (!sheetId) {
    throw new Error('No response sheet saved yet. Run createGlazedAndFiredProductIntakeForm first.');
  }

  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheets()[0];
  const range = sheet.getDataRange();
  const values = range.getDisplayValues();
  const richTextValues = range.getRichTextValues();

  if (values.length < 2) {
    throw new Error('No form responses found yet. Submit one test item first.');
  }

  const headers = values[0];
  const csvRows = [getSquarespaceHeaders_()];

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const title = getByHeader_(row, headers, 'Piece name');
    if (!title) continue;

    const status = getByHeader_(row, headers, 'Status');
    if (status && status !== 'Ready for website') continue;

    const imageUrls = [
      'Front photo',
      'Side photo',
      'Back photo',
      'Top photo',
    ].flatMap(photoHeader => getPublicImageUrls_(richTextValues[r], headers, photoHeader));

    csvRows.push([
      '',
      '',
      'PHYSICAL',
      'shop',
      slugify_(title),
      title,
      makeDescription_(row, headers),
      getByHeader_(row, headers, 'SKU or tracking code'),
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      cleanNumber_(getByHeader_(row, headers, 'Price')),
      '',
      'No',
      '1',
      '',
      'Glazed & Fired',
      shippingWeight_(getByHeader_(row, headers, 'Weight in pounds')),
      shippingDimension_(getByHeader_(row, headers, 'Length in inches')),
      shippingDimension_(getByHeader_(row, headers, 'Depth in inches')),
      shippingDimension_(getByHeader_(row, headers, 'Height in inches')),
      'No',
      imageUrls.join('\n'),
    ]);
  }

  const csv = csvRows.map(toCsvLine_).join('\r\n');
  const fileName = 'squarespace-products-' + Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyy-MM-dd-HHmm'
  ) + '.csv';

  const file = DriveApp.createFile(fileName, csv, MimeType.CSV);
  Logger.log('Squarespace CSV: ' + file.getUrl());
}

function getPublicImageUrls_(richTextRow, headers, photoHeader) {
  const index = headers.indexOf(photoHeader);
  if (index === -1) return [];

  const richText = richTextRow[index];
  const links = [];

  if (richText.getLinkUrl()) {
    links.push(richText.getLinkUrl());
  }

  richText.getRuns().forEach(run => {
    const url = run.getLinkUrl();
    if (url) links.push(url);
  });

  return [...new Set(links)].map(link => {
    const fileId = extractDriveFileId_(link);
    if (!fileId) return '';

    const file = DriveApp.getFileById(fileId);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(fileId);
  }).filter(Boolean);
}

function extractDriveFileId_(url) {
  const match = String(url || '').match(/[-\w]{25,}/);
  return match ? match[0] : '';
}

function makeDescription_(row, headers) {
  const name = getByHeader_(row, headers, 'Piece name');
  const notes = getByHeader_(row, headers, 'Notes');

  const width = getByHeader_(row, headers, 'Length in inches');
  const height = getByHeader_(row, headers, 'Height in inches');
  const depth = getByHeader_(row, headers, 'Depth in inches');
  const weightPounds = getByHeader_(row, headers, 'Weight in pounds');
  const weightOz = poundsToOunces_(weightPounds);

  const descriptionParts = [];

  descriptionParts.push(
    '<p>Meet ' + escapeHtml_(name) + ', a one of a kind, handmade clay sculpture. Kiln fired twice, high-fire glaze.</p>'
  );

  if (weightOz) {
    descriptionParts.push('<p>WEIGHT: ' + escapeHtml_(weightOz) + ' oz</p>');
  }

  if (width || height || depth) {
    descriptionParts.push(
      '<p>SIZE: Width ' + escapeHtml_(width) + ' in | Height ' + escapeHtml_(height) + ' in | Depth ' + escapeHtml_(depth) + ' in</p>'
    );
  }

  if (notes) {
    descriptionParts.push('<p>' + escapeHtml_(notes).replace(/\n+/g, '</p><p>') + '</p>');
  }

  descriptionParts.push(
    '<p>*Please note: Any minor imperfections are not considered defects, they are evidence of an original, unique, handcrafted piece of artwork created by an artisan.</p>'
  );

  descriptionParts.push('<p>ALL SALES ARE FINAL</p>');

  return descriptionParts.join('');
}

function poundsToOunces_(pounds) {
  const number = parseFloat(String(pounds || '').replace(/[^\d.]/g, ''));
  if (!number) return '';

  const ounces = number * 16;
  return formatDecimal_(ounces, 1);
}

function getByHeader_(row, headers, headerName) {
  const index = headers.indexOf(headerName);
  return index === -1 ? '' : row[index];
}

function getSquarespaceHeaders_() {
  return [
    'Product ID [Non Editable]',
    'Variant ID [Non Editable]',
    'Product Type [Non Editable]',
    'Product Page',
    'Product URL',
    'Title',
    'Description',
    'SKU',
    'GTIN',
    'MPN',
    'Option Name 1',
    'Option Value 1',
    'Option Name 2',
    'Option Value 2',
    'Option Name 3',
    'Option Value 3',
    'Price',
    'Sale Price',
    'On Sale',
    'Stock',
    'Categories',
    'Tags',
    'Weight',
    'Length',
    'Width',
    'Height',
    'Visible',
    'Hosted Image URLs',
  ];
}

function shippingWeight_(value) {
  const number = parseNumber_(value);
  if (!number) return '';
  return formatSquarespaceWeight_(number * 1.2);
}

function shippingDimension_(value) {
  const number = parseNumber_(value);
  if (!number) return '';
  return formatDecimal_(number + 1, 2);
}

function cleanNumber_(value) {
  const number = parseNumber_(value);
  return number ? formatDecimal_(number, 2) : '';
}

function parseNumber_(value) {
  const match = String(value || '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

function formatSquarespaceWeight_(number) {
  const text = formatDecimal_(number, 2);
  return number < 1 ? text.replace(/^0/, '') : text;
}

function formatDecimal_(number, places) {
  return Number(number.toFixed(places)).toString();
}

function slugify_(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml_(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toCsvLine_(row) {
  return row.map(value => {
    const text = String(value || '');
    return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
  }).join(',');
}
```
