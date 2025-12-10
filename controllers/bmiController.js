let records = [];
let idCounter = 1;

exports.create = (req, res) => {
    const { weightKg, heightCm, save } = req.body.weightKg ? req.body : req.query;

    if (!weightKg || !heightCm) return res.status(400).json({ error: 'Weight and height required' });

    const bmiValue = weightKg / ((heightCm / 100) ** 2);
    const bmi = parseFloat(bmiValue.toFixed(1));

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    const result = { bmi, category };

    if (save || req.query.save === 'on') {
        records.push({ id: idCounter++, bmi, category, weightKg, heightCm });
    }

    res.json(result);
};

exports.listRecords = (req, res) => res.json(records);

exports.getRecord = (req, res) => {
    const r = records.find(r => r.id === parseInt(req.params.id));
    if (!r) return res.status(404).json({ error: 'Record not found' });
    res.json(r);
};

exports.updateRecord = (req, res) => {
    const r = records.find(r => r.id === parseInt(req.params.id));
    if (!r) return res.status(404).json({ error: 'Record not found' });

    const { weightKg, heightCm } = req.body;
    if (weightKg) r.weightKg = weightKg;
    if (heightCm) r.heightCm = heightCm;

    const bmiValue = r.weightKg / ((r.heightCm / 100) ** 2);
    r.bmi = parseFloat(bmiValue.toFixed(1));
    r.category = r.bmi < 18.5 ? 'Underweight' : r.bmi < 25 ? 'Normal' : r.bmi < 30 ? 'Overweight' : 'Obese';

    res.json(r);
};

exports.deleteRecord = (req, res) => {
    const index = records.findIndex(r => r.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Record not found' });
    records.splice(index, 1);
    res.json({ success: true });
};