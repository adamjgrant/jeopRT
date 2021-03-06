m.column.acts({
    exists(_$, args) {
        return !!_$.act.get_column_by_id(args);
    },

    generate_markup(_$, args) {
        return `
            <div data-component="column" data-column="${args.id}">
                <div class="header"><h1>${args.name}</h1></div>
            </div>
        `
    },

    add_answers(_$, args) {
        if (_$.act.same_as_cache(args)) return;
        if (!args.answers) return console.error(`Category ${args.name} has no answers`);
        args.answers = _$.act.sort_answers(args);
        m.column.cache[args.id] = args
        const markup = args.answers
            .map(answer => m.answer.act.generate_markup(answer))
            .join("\n");
        const this_column = _$.act.get_column_by_id(args)
        _$.act.remove_answers(args);
        this_column.innerHTML += markup;
    },

    set_header_visibility(_$, args) {
        const disabled = _$.act.all_questions_answered_for_column(args);
        const this_column = _$.act.get_column_by_id(args).querySelector(".header");
        if (disabled) this_column.classList.add("hide");
    },

    remove_answers(_$, args) {
        document.querySelectorAll(`[data-column='${args.id}'] [data-component~='answer']`).forEach(answer => answer.remove());
    },

    priv: {
        same_as_cache(_$, args) {
            return JSON.stringify(args) === JSON.stringify(m.column.cache[args.id]);
        },

        get_column_by_id(_$, args) {
            // const me = Array.from(_$.me());
            // Don't know why I can't do this some of the time.
            const me = Array.from(document.querySelectorAll("[data-component='column']"));
            if (!me.length) {
                return false;
            }
            return (me.filter(column => column.dataset.column === args.id) || [])[0];
        },

        sort_answers(_$, args) {
            return args.answers.sort((p, n) => {
                return (parseInt(p.price) > parseInt(n.price)) ? 1 : -1;
            });
        },

        all_questions_answered_for_column(_$, args) {
            if (!m.column.cache[args.id]) return false;
            return m.column.cache[args.id].answers.every(answer => answer.answered);
        }
    }
});

m.column.cache = {};