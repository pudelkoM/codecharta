"use strict";

import angular from "angular";
import "../core.module";
import {ReportService} from "./report.service";

angular.module("app.codeCharta.core.report", ["app.codeCharta.core"])
    .service(
        ReportService.SELECTOR, ReportService
    );


