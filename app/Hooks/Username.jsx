// Funcion para generar el username para la url a partir del nombre

export function generateUsername(name) {
    if (!name || typeof name !== "string") return "";
    return name.toLowerCase().replace(/\s+/g, "");
}


