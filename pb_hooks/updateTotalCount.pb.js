// <reference path="../pb_data/types.d.ts" />

onRecordAfterUpdateRequest((e) => {
    // Only run for the counter collection
    if (e.collection.name !== "counter") return;

    // Get the record
    const record = e.record;

    // Update total_cases as sum of count and archived
    record.set("total_count", (record.get("count") || 0) + (record.get("archived") || 0));

    // Save the record
    $app.dao().saveRecord(record);
});