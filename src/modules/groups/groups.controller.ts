import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { UpdateGroupDto } from './dto/update.group.dto';
import { FilterDto } from './dto/filter.dto';

@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupService: GroupsService) {}

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Get('all')
    getAllGroups(@Query() filter: FilterDto) {
        return this.groupService.getAllGroups(filter);
    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Get(':id')
    getOneGroup(@Param('id', ParseIntPipe) id: number) {
        return this.groupService.getOneGroup(id);
    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('one/students/:groupId')
    getOneGroupStudents(@Param('groupId', ParseIntPipe) groupId: number) {
        return this.groupService.getOneGroupStudents(groupId);
    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post('create')
    createGroup(@Body() payload: CreateGroupDto) {
        return this.groupService.createGroup(payload);
    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Put('update/:id')
    updateGroup(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateGroupDto,
    ) {
        return this.groupService.updateGroup(id, payload);
    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete('delete/:id')
    deleteGroup(@Param('id', ParseIntPipe) id: number) {
        return this.groupService.deleteGroup(id);
    }
}