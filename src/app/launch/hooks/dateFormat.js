import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function dateFormatLocal(date) {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss (Z)');
}

export function dateFormatUTC(date) {
    dayjs.extend(utc);
    return dayjs.utc(date).format('YYYY-MM-DD HH:mm:ss');
}

export function dateFormatMid(date) {
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
}

