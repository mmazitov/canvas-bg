// Utility function to create a particle
const createParticle = (canvasWidth, canvasHeight) => {
	return {
			x: Math.random() * canvasWidth, // Random x-coordinate within canvas width
			y: Math.random() * canvasHeight, // Random y-coordinate within canvas height
			size: Math.random() * 3 + 1, // Random size for the particle
			speedX: Math.random() * 3 - 1.5, // Horizontal speed in a random direction
			speedY: Math.random() * 3 - 1.5, // Vertical speed in a random direction
			color: 'white' // Initial color of the particle
	};
};

// Function to update the state of a particle
const updateParticle = (particle, mouse, canvasWidth, canvasHeight, hue) => {
	const updatedParticle = { ...particle };

	// Move particle based on its speed
	updatedParticle.x += updatedParticle.speedX;
	updatedParticle.y += updatedParticle.speedY;

	// Bounce off canvas edges
	if (updatedParticle.x < 0 || updatedParticle.x > canvasWidth) {
			updatedParticle.speedX *= -1; // Reverse horizontal direction
	}
	if (updatedParticle.y < 0 || updatedParticle.y > canvasHeight) {
			updatedParticle.speedY *= -1; // Reverse vertical direction
	}

	// Interact with mouse proximity
	if (mouse.x !== null && mouse.y !== null) {
			const dx = mouse.x - updatedParticle.x; // Distance along x-axis
			const dy = mouse.y - updatedParticle.y; // Distance along y-axis
			const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance

			// Repel particles if close to the mouse
			if (distance < 100) {
					updatedParticle.x -= dx / 20;
					updatedParticle.y -= dy / 20;
			}
	}

	// Change color dynamically based on hue
	updatedParticle.color = `hsla(${hue}, 100%, 50%, 0.7)`;

	return updatedParticle;
};

// Function to draw a particle on the canvas
const drawParticle = (ctx, particle) => {
	ctx.beginPath();
	ctx.fillStyle = particle.color; // Set particle color
	ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); // Draw a circle
	ctx.fill(); // Fill the circle
};

// Main function to manage the particle animation
const createParticleBackground = (canvas) => {
	const ctx = canvas.getContext('2d');
	const mouse = { x: null, y: null }; // Mouse position
	let hue = 0; // Hue for color transitions
	let particles = []; // Array to store particles

	// Resize canvas and reset particles
	const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			// Create new particles based on canvas size
			const particleCount = Math.floor(canvas.width / 10);
			particles = Array.from(
					{ length: particleCount },
					() => createParticle(canvas.width, canvas.height)
			);
	};

	// Handle mouse movement
	const handleMouseMove = (event) => {
			const rect = canvas.getBoundingClientRect();
			mouse.x = event.clientX - rect.left; // Adjust for canvas offset
			mouse.y = event.clientY - rect.top;
	};

	// Reset mouse position when it leaves the canvas
	const handleMouseLeave = () => {
			mouse.x = null;
			mouse.y = null;
	};

	// Animation loop
	const animate = () => {
			hue = (hue + 0.5) % 360; // Gradually shift hue

			// Clear canvas with a semi-transparent background
			ctx.fillStyle = `hsl(${hue}, 20%, 10%)`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Update and draw each particle
			particles = particles.map(particle =>
					updateParticle(particle, mouse, canvas.width, canvas.height, hue)
			);
			particles.forEach(particle => drawParticle(ctx, particle));

			// Request the next animation frame
			requestAnimationFrame(animate);
	};

	// Initialize the animation setup
	const init = () => {
			resize(); // Set initial size and particles
			window.addEventListener('resize', resize); // Adjust on window resize
			canvas.addEventListener('mousemove', handleMouseMove); // Track mouse movement
			canvas.addEventListener('mouseleave', handleMouseLeave); // Reset on mouse leave
			animate(); // Start animation
	};

	return init; // Return the initialization function
};

// Initialize the animation when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('particleCanvas'); // Target canvas element
	const initParticleBackground = createParticleBackground(canvas);
	initParticleBackground(); // Start the animation
});
