onRecordUpdate((e) => {
  const oldRecord = e.record.original();

  const oldStatus = oldRecord?.get("status");
  const newStatus = e.record.get("status");

  if (oldStatus !== newStatus) {
    e.record.set("previous_status", oldStatus);
  }

  e.next();
}, "users");