import { Injectable } from '@nestjs/common';
import { ClassesService } from 'src/classes/services/classes.service';
import { LocationsService } from 'src/classes/services/locations.service';
import { SchedulesService } from 'src/classes/services/schedules.service';

@Injectable()
export class SeedService {
    constructor(
        private readonly locationService: LocationsService,
        private readonly classService: ClassesService,
        private readonly scheduleService: SchedulesService,
    ) { }

    async seed() {
        // Crear ubicaciones
        const location1 = await this.locationService.create({ locationName: 'San Borja', address: 'Club Loreto' });
        const location2 = await this.locationService.create({ locationName: 'Miraflores', address: '456 Elm St' });

        // Crear clases
        const class1 = await this.classService.create(location1.id, { className: 'Marinera Limeña Avanzado', description: 'Marinera para nivel avanzado adultos' });
        const class2 = await this.classService.create(location2.id, { className: 'Marinera Limeña Intermedio', description: 'Marinera para nivel intermedio adultos y jovenes' });
        const class3 = await this.classService.create(location1.id, { className: 'Marinera Norteña Intermedio', description: 'Marinera para nivel intermedio adultos y jovenes' });

        // Crear horarios
        const schedule1 = await this.scheduleService.create(class1.id, { dayOfWeek: 1, startTime: '09:00', endTime: '10:00' });
        const schedule2 = await this.scheduleService.create(class1.id, { dayOfWeek: 3, startTime: '11:00', endTime: '12:00' });
        const schedule3 = await this.scheduleService.create(class1.id, { dayOfWeek: 3, startTime: '12:00', endTime: '13:00' });

        return { message: 'Database seeded successfully' };
    }
}
