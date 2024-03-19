export default class ApplicationError {

    constructor(
        readonly privateMessage: string,
        readonly publicMessage: string = ''
    ) { }

}