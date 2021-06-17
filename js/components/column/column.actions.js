m.column.acts({
    exists(_$, args) {
        return !!_$.act.get_column_by_name(args);
    },
    
    generate_markup(_$, args) {
        return `
            <div data-component="column" data-column="${args.name}">
                <div class="header">${args.name}</div>
            </div>
        ` 
    },

    add_answers(_$, args) {
        if (_$.act.same_as_cache(args)) return;
        if (!args.answers) return console.error(`Category ${args.name} has no answers`);
        m.column.cache[args.name] = args
        const markup = args.answers
          .map(answer => m.answer.act.generate_markup(answer))
          .join("\n");
        const this_column = _$.act.get_column_by_name(args)
        this_column.querySelectorAll("[data-component~='answer']") // TODO delete all existing answers
        this_column.innerHTML += markup;

    },

    priv: {
        same_as_cache(_$, args) {
            return JSON.stringify(args) === JSON.stringify(m.column.cache[args.name]);
        },

        get_column_by_name(_$, args) {
            return (Array.from(_$.me()).filter(column => column.dataset.column === args.name) || [])[0];
        }
    }
});

m.column.cache = [];
