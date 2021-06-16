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
            if (err) { args.handle_errors(err); return; } 
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

    priv: {
        table(_$, args) {
            if (m.airtable.base) return m.airtable.base;
            const Airtable = require('airtable');
            const base = new Airtable({ apiKey: airtable_api_key }).base(airtable_base_id);
            m.airtable.base = base;
            return base(args.name);
        }
    }
});