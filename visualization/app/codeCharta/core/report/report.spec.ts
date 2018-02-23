import {NGMock} from "../../../ng.mockhelper";
import DoneCallback = jest.DoneCallback;
import "./report.module";
import {ReportService} from "./report.service";
import {DataService} from "../data/data.service";
import {TEST_FILE_CONTENT, TEST_FILE_DATA} from "../data/data.mocks";

describe("report.service", () => {

    let reportService: ReportService;
    let dataService: DataService;

    beforeEach(NGMock.mock.module("app.codeCharta.core.report"));

    beforeEach(NGMock.mock.inject((_reportService_, _dataService_) => {
        reportService = _reportService_;
        dataService = _dataService_;
    }));

    it("should return correct sample report", () => {
        let csv = reportService.generateCSVReport(TEST_FILE_DATA);
        expect(csv).toBe(
            "path,Functions,MCC,RLOC\n" +
            "/root/big leaf,10,1,100\n" +
            "/root/Parent Leaf/other small leaf,1000,10,70\n" +
            "/root/Parent Leaf/small leaf,100,100,30\n"
        )
    });

    it("should return correct report for empty map", () => {
        let csv = reportService.generateCSVReport({
            fileName: "something",
            projectName: "else",
            root: null
        }
    );
        expect(csv).toBe(
            ""
        )
    });


});