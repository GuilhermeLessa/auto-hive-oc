export default class Functions {

    static isNum(string: string): boolean {
        return /^\d+$/.test(string);
    }

}