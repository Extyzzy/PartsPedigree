import Moment from "moment/moment";

export const formatPartDate = (date = Date.now()) => {
    return Moment(+date).format('DD/MMM/YY HH[h]mm');
};

export const formatTimelineDate = (date = Date.now()) => {
  return Moment(+date).format('DD/MM/YY');
};