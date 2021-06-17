m.answer.acts({
    generate_markup(_$, args) {
        return `
            <div data-component="answer" data-answer="${args.answer}">
                <div class="header">${args.answer}</div>
            </div>
        ` 
    }
});
