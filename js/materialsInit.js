const materialsProgress = new MaterialsProgress();

document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('materials.html')) {
        try {
            await materialsProgress.loadProgress();
            materialsProgress.displayProgress();
            
            // Add progress tracking to material sections
            document.querySelectorAll('.material-list li').forEach(item => {
                item.addEventListener('click', async () => {
                    const section = item.dataset.section;
                    await materialsProgress.updateProgress(section, 25);
                    materialsProgress.displayProgress();
                });
            });
        } catch (error) {
            console.error('Error initializing materials:', error);
        }
    }
});