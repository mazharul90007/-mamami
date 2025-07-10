import { CirclesService } from '../app/modules/Circles/circles.service';

async function initializeCircles() {
  try {
    console.log('Initializing default circles...');
    await CirclesService.initializeDefaultCircles();
    console.log('Default circles initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing circles:', error);
    process.exit(1);
  }
}

initializeCircles(); 