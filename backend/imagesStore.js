const images = new Map(); // id -> { id, filename, mimetype, buffer }
module.exports = {
    list() {
        return Array.from(images.values()).map(({ id, filename, mimetype }) => ({ id, filename, mimetype }));
    },
    get(id) {
        return images.get(id) || null;
    },
    add(image) {
        images.set(image.id, image);
    },
    remove(id) {
        return images.delete(id);
    },
    clear() {
        images.clear();
    }
};