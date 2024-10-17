import { http } from "./config"

export let movieService = {
    getListMovie: () => {
        return http.get("/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP01")
    },
    getTheaterMovie: () => {
        return http.get("/api/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP01")
    },
    getDetailMovie: (id) => {
        return http.get(`/api/QuanLyPhim/LayThongTinPhim?MaPhim=${id}`)
    },
    getDetailSchedule: (id) => {
        return http.get(`/api/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${id}`)
    },
    getBookTicket: (id) => {
        return http.get(`/api/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${id}`)
    }
}

export let adminService = {
    getListUser: () => {
        return http.get("/api/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01")
    }
}