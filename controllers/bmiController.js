const store = require ('../data/store');

function calculateBMI({ weightKg, heightCm }) {
    const h = heightCm / 100;
    if (h <= 0) throw new Error('height must be > 0');
    const bmi = weightKg / (h * h);
    return Math.round(bmi * 100) / 100; // 2 decimals
}


function categoryFromBMI(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}


// POST /api/bmi body: { weightKg, heightCm, save?: boolean }
function create(req, res) {
    try {
        // Accept numbers either as numbers or strings — convert
        const weightKg = Number(req.body.weightKg ?? req.query.weightKg);
        const heightCm = Number(req.body.heightCm ?? req.query.heightCm);


        if (!weightKg || !heightCm || isNaN(weightKg) || isNaN(heightCm)) {
            return res.status(400).json({ error: 'weightKg and heightCm are required and must be numbers' });
        }


        const bmi = calculateBMI({ weightKg, heightCm });
        const category = categoryFromBMI(bmi);
        const result = { weightKg, heightCm, bmi, category };


        // Optionally save the calculation if ?save=true or body.save === true
        const saveFlag = req.body.save === true || req.body.save === 'true' || req.query.save === 'true';
        if (saveFlag) {
            const saved = store.addRecord(result);
            return res.status(201).json({ result, saved });
        }


        return res.json({ result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


// GET /api/bmi/records -> all saved records (supports query limit)
function listRecords(req, res) {
    const all = store.getAll();
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    if (limit && !isNaN(limit)) {
    return res.json(all.slice(0, limit));
    }
    res.json(all);
}


// GET /api/bmi/records/:id
function getRecord(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'id must be a number' });
    const r = store.getById(id);
    if (!r) return res.status(404).json({ error: 'Record not found' });
    res.json(r);
}

// PUT /api/bmi/records/:id body: { weightKg, heightCm }
function updateRecord(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'id must be a number' });
    const patch = {};
    if (req.body.weightKg) patch.weightKg = Number(req.body.weightKg);
    if (req.body.heightCm) patch.heightCm = Number(req.body.heightCm);


    if (Object.keys(patch).length === 0) return res.status(400).json({ error: 'No updatable fields provided' });


    // If we got both fields, recalc bmi/category
    if (patch.weightKg && patch.heightCm) {
        const bmi = calculateBMI({ weightKg: patch.weightKg, heightCm: patch.heightCm });
        patch.bmi = bmi;
        patch.category = categoryFromBMI(bmi);
    } else if (patch.weightKg || patch.heightCm) {
        // fetch existing, merge then recalc
        const existing = store.getById(id);
        if (!existing) return res.status(404).json({ error: 'Record not found' });
        const weight = patch.weightKg || existing.weightKg;
        const height = patch.heightCm || existing.heightCm;
        const bmi = calculateBMI({ weightKg: weight, heightCm: height });
        patch.weightKg = weight;
        patch.heightCm = height;
        patch.bmi = bmi;
        patch.category = categoryFromBMI(bmi);
    }


    const updated = store.updateById(id, patch);
    if (!updated) return res.status(404).json({ error: 'Record not found' });
    res.json(updated);
}


// DELETE /api/bmi/records/:id
function deleteRecord(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'id must be a number' });
    const ok = store.deleteById(id);
    if (!ok) return res.status(404).json({ error: 'Record not found' });
    res.json({ success: true });
}

module.exports = { create, listRecords, getRecord, updateRecord, deleteRecord}