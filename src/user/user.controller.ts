import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAcademicRecordDto } from './dto/create-academic-record.dto';
import { UpdateAcademicRecordDto } from './dto/update-academic-record.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    // POST /user/:userCode/academic-records
    @Post(':userCode/academic-records')
    addAcademicRecord(
        @Param('userCode') userCode: string,
        @Body() dto: CreateAcademicRecordDto,
    ) {
        console.log(`[POST] /user/${userCode}/academic-records called with body:`, dto);
        return this.userService.addAcademicRecord(userCode, dto);
    }

    // PATCH /user/:userCode/academic-records/:recordId
    @Patch(':userCode/academic-records/:recordId')
    updateAcademicRecord(
        @Param('userCode') userCode: string,
        @Param('recordId') recordId: string,
        @Body() dto: UpdateAcademicRecordDto,
    ) {
        return this.userService.updateAcademicRecord(userCode, recordId, dto);
    }

    // GET /user/:userCode/academic-records
    @Get(':userCode/academic-records')
    getAcademicRecords(@Param('userCode') userCode: string) {
        return this.userService.getAcademicRecords(userCode);
    }

    // GET /user/:userCode/current-grade
    @Get(':userCode/current-grade')
    getCurrentGrade(@Param('userCode') userCode: string) {
        return this.userService.getCurrentGrade(userCode);
    }
}
