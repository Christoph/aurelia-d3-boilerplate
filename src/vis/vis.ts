export class Vis {
    test = "Vis!"

    data = [
        {"salesperson" : "Bob", "sales": 12},
        {"salesperson" : "Robin", "sales": 1},
        {"salesperson" : "Anne", "sales": 8},
        {"salesperson" : "Chris", "sales": 5}
    ]

    add() {
        this.data.push({"salesperson" : "Test", "sales": 20});
    }
}
