class Formatter {
    /**
     * @param {*} data 
     * @returns 
     */
    encodersList(data) {
        let list = [];
        for (let i in data) {
            list.push({
                type: data[i].type,
                tag: i,
                name: data[i].description
            });
        }
        return list;
    }

    /**
     * @param {*} data 
     * @returns 
     */
    formatsList(data) {
        const formats = [];
        for (let i in data) {
          formats.push({
            tag: i,
            name: data[i].description
          });
        }
        return formats;
    }
}

export { Formatter };