import { describe, expect, it } from 'vitest';
import { CreateAppointment } from './create-appointment';
import { Appointment } from '../entities/appointment';
import { getFutureDate } from '../tests/utils/get-future-date';
import { InMemoryAppointmentsRepository } from '../repositories/in-memory/in-memory-appointments-repository';

describe('Create Appointment', () => {
  it('should be able to create an appointment', () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    const startsAt = getFutureDate('2023-06-27');
    const endsAt = getFutureDate('2023-06-28');
    
    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment);
  });

  it('should not be able to create an appointment with overlapping dates', async () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    const startsAt = getFutureDate('2023-06-20');
    const endsAt = getFutureDate('2023-06-28');

    await createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    });
    
    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2023-06-24'),
      endsAt: getFutureDate('2023-06-28')
    })).rejects.toBeInstanceOf(Error);

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2023-06-16'),
      endsAt: getFutureDate('2023-06-25')
    })).rejects.toBeInstanceOf(Error);

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2023-06-10'),
      endsAt: getFutureDate('2023-06-30')
    })).rejects.toBeInstanceOf(Error);

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2023-06-22'),
      endsAt: getFutureDate('2023-06-25')
    })).rejects.toBeInstanceOf(Error);
  });
});