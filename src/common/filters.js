const formatMoney = function (value) {
    if (!value) return value;

    return `R$ ${value.toFixed(2)}`;
}

const formatWeight = function (value) {
    if (!value) return value;

    return parseFloat(value).toFixed(3).replace('.', ',')
}

const filterDayOfWeek = function(value) {
    let day;

    switch (value) {
        case 0:
            day = 'Domingo';
            break;
        case 1:
            day = 'Segunda-feira';
            break;
        case 2:
            day = 'Terça-feira';
            break;
        case 3:
            day = 'Quarta-feira';
            break;
        case 4:
            day = 'Quinta-feira';
            break;
        case 5:
            day = 'Sexta-feira';
            break;
        case 6:
            day = 'Sábado';
            break;
    }

    return day;
}

const formatDate = function(value) {
    let formatedDate = '';

    if (value) {
        const date = value.split('-');
        let day = date[2].length === 1 ? `0${date[2]}` : date[2];
        let mounth = date[1].length === 1 ? `0${date[1]}` : date[1];

        formatedDate = `${day}/${mounth}/${date[0]}`;
    }

    return formatedDate;
}

export { 
    formatMoney,
    formatWeight,
    filterDayOfWeek,
    formatDate
};