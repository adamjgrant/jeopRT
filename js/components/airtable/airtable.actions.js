m.airtable.act({
    /* Expects
    {
        table: "table name",
        params: {
            maxRecords: 3,
            view: "Grid view"
        },
        handle_records: (records_page) => {}, // Page records handler
        done: () => {},                       // Done with each handle_records call
        handle_error: (error) => {}           // Error handler
    } */
    list(_$, args) {
        _$.act.table({ name: args.table }).select(args.params).eachPage(function page(records, fetchNextPage) {
            args.handle_records(records);
            fetchNextPage();
        }, function done(err) {
            if (err) {
                console.error("Error for table query: " + args.table);
                args.handle_errors(err);
                return;
            }
            args.done()
        });
    },

    /* Expects
    {
        table: "table name",
        column_name: "Name",
        value: "Bob"
        params: { },
        done: (record) => {},                 // Done with each handle_records call
        handle_error: (error) => {}           // Error handler
    } */
    get_by_value(_$, args) {
        let record;
        const filterFormula = `{${args.column_name}} = "${args.value}"`;

        if (!args.value) return console.error("No game ID found");

        _$.act.table({ name: args.table }).select({
            filterByFormula: filterFormula
        }).eachPage(function page(records, fetchNextPage) {
            record = records[0];
            fetchNextPage();
        }, function done(error) {
            if (error) { args.handle_error(error); return; }
            args.done(record);
        });
    },

    /* Expects
    {
        table: "table name",
        record_ids: [],
        done: (record) => {},                 // Done with each handle_records call
        handle_error: (error) => {}           // Error handler
    } */
    find_all(_$, args) {
        let _records = [];
        const filterFormula = "OR(" + args.record_ids.map(id => { return `RECORD_ID()='${id}'` }).join(",") + ")";

        _$.act.table({ name: args.table }).select({
            filterByFormula: filterFormula
        }).eachPage(function page(records, fetchNextPage) {
            _records = _records.concat(records);
            fetchNextPage();
        }, function done(error) {
            if (error) { args.handle_error(error); return; }
            args.done(_records);
        });
    },

    priv: {
        table(_$, args) {
            if (m.airtable.base[args.name]) return m.airtable.base[args.name](args.name);
            const Airtable = require('airtable');
            const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
            m.airtable.base[args.name] = base;
            return base(args.name);
        }
    }
});

m.airtable.base = {};