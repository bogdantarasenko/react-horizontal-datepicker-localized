/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { addDays, addMonths, differenceInMonths, format, isSameDay, lastDayOfMonth, startOfMonth } from "date-fns";
import { ru } from 'date-fns/locale';
import enUsLocale from "date-fns/locale/en-US";
const Container = styled.div`
    display: flex;
    width: 100%;
    background: inherit;
`;
const ButtonWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    z-index: 2;
    background: inherit;
`;
const Button = styled.button`
    border: none;
    text-decoration: none;
    cursor: pointer;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-bottom: 5px;
`;
const DateListScrollable = styled.div`
    display: flex;
    overflow-x: scroll;
    scrollbar-width: none;
    margin: 2px 0 2px -40px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
        -webkit-appearance: none;
        display: none;
    }
`;
const MonthContainer = styled.div`
    & span {
        display: flex;
        flex-direction: column;
    }
`;
const MonthYearLabel = styled.div`
    align-self: flex-start;
    z-index: 3;
    font-size: 15px;
    font-weight: bold;
    position: sticky;
    top: 0;
    left: 0;
    width: max-content;
    margin: 0 14px 10px 0;
`;
const DateDayItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin: 0 0 0 5px;
    width: 45px;
    height: 49px;
    flex-shrink: 0;
`;
const DaysContainer = styled.div`
    display: flex;
    z-index: 1;
`;
const DayLabel = styled.div`
    font-size: 3px;
    margin: 4px 0 0 0;
    visibility: hidden;
`;
const DateLabel = styled.div`
    font-size: 18px;
`;
export default function DatePicker({
  endDate,
  selectDate,
  getSelectedDay,
  color,
  labelFormat,
  language
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const firstSection = {
    marginLeft: '40px'
  };
  const startDate = new Date();
  const lastDate = addDays(startDate, endDate || 90);
  const primaryColor = color || 'rgb(54, 105, 238)';
  const selectedStyle = {
    fontWeight: "bold",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border: `2px solid ${primaryColor}`,
    color: primaryColor
  };
  const buttonColor = {
    background: primaryColor
  };
  const labelColor = {
    color: primaryColor
  };

  const getStyles = day => {
    if (isSameDay(day, selectedDate)) {
      return selectedStyle;
    }

    return null;
  };

  const getId = day => {
    if (isSameDay(day, selectedDate)) {
      return 'selected';
    } else {
      return "";
    }
  };

  function renderDays(lang) {
    const dayFormat = "E";
    const dateFormat = "d";
    const months = [];
    let days = [];

    for (let i = 0; i <= differenceInMonths(lastDate, startDate); i++) {
      let start, end;
      const month = startOfMonth(addMonths(startDate, i));
      start = i === 0 ? Number(format(startDate, dateFormat)) - 1 : 0;
      end = i === differenceInMonths(lastDate, startDate) ? Number(format(lastDate, "d")) : Number(format(lastDayOfMonth(month), "d"));

      for (let j = start; j < end; j++) {
        days.push( /*#__PURE__*/React.createElement(DateDayItem, {
          id: `${getId(addDays(startDate, j))}`,
          style: getStyles(addDays(month, j)),
          key: addDays(month, j),
          onClick: () => onDateClick(addDays(month, j))
        }, /*#__PURE__*/React.createElement(DayLabel, null, format(addDays(month, j), dayFormat)), /*#__PURE__*/React.createElement(DateLabel, null, format(addDays(month, j), dateFormat))));
      }

      months.push( /*#__PURE__*/React.createElement(MonthContainer, {
        key: month
      }, /*#__PURE__*/React.createElement(MonthYearLabel, {
        style: labelColor
      }, format(month, labelFormat || "MMMM yyyy", {
        locale: lang
      })), /*#__PURE__*/React.createElement(DaysContainer, {
        style: i === 0 ? firstSection : null
      }, days)));
      days = [];
    }

    return /*#__PURE__*/React.createElement(DateListScrollable, {
      id: "container"
    }, months);
  }

  const onDateClick = day => {
    setSelectedDate(day);

    if (getSelectedDay) {
      getSelectedDay(day);
    }
  };

  useEffect(() => {
    if (getSelectedDay) {
      if (selectDate) {
        getSelectedDay(selectDate);
      } else {
        getSelectedDay(startDate);
      }
    }
  }, []);
  useEffect(() => {
    if (selectDate) {
      if (!isSameDay(selectedDate, selectDate)) {
        setSelectedDate(selectDate);
        setTimeout(() => {
          let view = document.getElementById('selected');

          if (view) {
            view.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest"
            });
          }
        }, 20);
      }
    }
  }, [selectDate]);

  const nextWeek = () => {
    const e = document.getElementById('container');
    const width = e ? e.getBoundingClientRect().width : null;
    e.scrollLeft += width - 60;
  };

  const prevWeek = () => {
    const e = document.getElementById('container');
    const width = e ? e.getBoundingClientRect().width : null;
    e.scrollLeft -= width - 60;
  };

  let langCode;

  switch (language) {
    case "en":
      langCode = enUsLocale;
      break;

    case "ru":
      langCode = ru;
      break;

    default:
      langCode = ru;
      break;
  }

  return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(ButtonWrapper, null, /*#__PURE__*/React.createElement(Button, {
    style: buttonColor,
    onClick: prevWeek
  }, "\u2190")), renderDays(langCode), /*#__PURE__*/React.createElement(ButtonWrapper, null, /*#__PURE__*/React.createElement(Button, {
    style: buttonColor,
    onClick: nextWeek
  }, "\u2192")));
}