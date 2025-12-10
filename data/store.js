// Простейшее in-memory хранилище для записей BMI
// (для демонстрации PUT/DELETE операций)


let records = [];
let nextId = 1;


function addRecord(record) {
    const saved = { id: nextId++, createdAt: new Date().toISOString(), ...record };
    records.push(saved);
    return saved;
}


function getAll() { return records.slice(); }
function getById(id) { return records.find(r => r.id === id); }
function updateById(id, patch) {
const r = getById(id);
    if (!r) return null;
    Object.assign(r, patch);
    r.updatedAt = new Date().toISOString();
    return r;
}
function deleteById(id) {
    const idx = records.findIndex(r => r.id === id);
    if (idx === -1) return false;
    records.splice(idx, 1);
    return true;
}


module.exports = { addRecord, getAll, getById, updateById, deleteById };