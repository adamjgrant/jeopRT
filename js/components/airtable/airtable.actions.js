m.airtable.act({
    /* Expects
    {
        table: "table name",
        params: {
            maxRecords: 3,
            view: "Grid view"
        },
        cb: (records_page) => {}, // Success handler
        ecb: (error) => {} // Error handler
    } */

    list(_$, args) {
        _$.act.table(args.table).select(args.params).eachPage(function page(records, fetchNextPage) {
            args.cb(records);
            fetchNextPage();
        }, function done(err) { if (err) { args.ecb(err); return; } });
    },

    priv: {
        get table() {
            if (m.airtable.base) return m.airtable.base;
            const Airtable = require('airtable');
            const base = new Airtable({ apiKey: airtable_api_key }).base(airtable_base_id);
            m.airtable.base = base;
            return base;
        }
    }
});