import moment from 'moment'

export default {
    filters: {
        formatDate(date) {
            return moment(date).format("DD.MM.YYYY.");
        }
    }
};