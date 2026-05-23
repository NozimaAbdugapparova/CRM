import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

// dashboard.module.ts
@Module({
  controllers: [DashboardController],
  providers:   [DashboardService],
})
export class DashboardModule {}