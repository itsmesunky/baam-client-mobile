import { customAxios } from "../instance";
import { AddAgendaData, AgendaData } from "./calendar.type";

// 등록한 일정 가져오는 API
export const getAgenda = async ({ year, month }: AgendaData) => {
  const response = await customAxios.get(`/calendar/${year}/${month}`);
  return response.data.list;
};

// 일정 등록 API
export const addAgenda = async (data: AddAgendaData) => {
  const response = await customAxios.post("/calendar/event", data);
  return response.data;
};

// 일정 삭제 API
export const deleteAgenda = async (id: string) => {
  const response = await customAxios.delete(`/calendar/${id}`);
  return response.data;
};
