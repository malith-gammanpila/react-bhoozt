const UniqueID = () => {
    return '' + new Date().valueOf() + '_' + Math.random().toString(36).substr(2, 9);
};

export {
    UniqueID
}