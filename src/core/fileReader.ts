
export const fileGetContents = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const fileAsBinaryString = reader.result;
            resolve(fileAsBinaryString);
        };
        reader.onabort = () => reject('file reading was aborted');
        reader.onerror = () => reject('file reading has failed');

        reader.readAsBinaryString(file);
    });
}