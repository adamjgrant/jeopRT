m.answer.acts({
    generate_markup(_$, args) {
        return `
            <div data-component="answer" data-answer="${args.name}">
                <div class="price">${args.price}</div>
                <div class="full-text">${args.name}</div>
            </div>
        ` 
    }
});
