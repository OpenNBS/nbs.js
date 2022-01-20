export function canParse(json) {
    let pass = false;

    try {
        JSON.parse(json);
        pass = true;
    } catch {}

    return pass;
}
