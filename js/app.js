/* ============================================
   RecipeHub — Complete JavaScript Application
   With TheMealDB API + Local Tamil/Indian Recipes
   ============================================ */

(function () {
    'use strict';

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    function debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ==========================================
    // TOAST NOTIFICATION SYSTEM
    // ==========================================
    const Toast = {
        container: null,
        init() {
            this.container = document.createElement('div');
            this.container.className = 'toast';
            this.container.setAttribute('role', 'alert');
            this.container.setAttribute('aria-live', 'assertive');
            document.body.appendChild(this.container);
        },
        show(message, type = 'default', duration = 3000) {
            if (!this.container) this.init();
            this.container.textContent = message;
            this.container.className = 'toast ' + type;
            requestAnimationFrame(() => { this.container.classList.add('show'); });
            setTimeout(() => { this.container.classList.remove('show'); }, duration);
        }
    };

    // ==========================================
    // LOCAL STORAGE HELPER
    // ==========================================
    const Storage = {
        get(key, fallback = null) {
            try { const d = localStorage.getItem('recipehub_' + key); return d ? JSON.parse(d) : fallback; }
            catch { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem('recipehub_' + key, JSON.stringify(value)); }
            catch (e) { console.warn('Storage error:', e); }
        },
        remove(key) {
            try { localStorage.removeItem('recipehub_' + key); } catch {}
        }
    };

    // ==========================================
    // LOCAL RECIPE DATA — 24 Recipes
    // ==========================================
    const RecipeData = {
        recipes: [
  {
    id: 1,
    title: 'Chicken Biryani',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    rating: 4.9,
    time: '90 min',
    servings: '4 servings',
    difficulty: 'Hard',
    calories: 520,
    description: 'Aromatic rice dish layered with spiced chicken, fragrant basmati rice, and saffron. A royal Mughlai delicacy popular across India.',
    ingredients: ['500g chicken', '2 cups basmati rice', '3 onions, sliced', '1 cup yogurt', '2 tbsp ginger-garlic paste', '4 green chilies', '1/2 cup mint leaves', '1/2 cup cilantro', '1 tsp garam masala', '1 tsp red chili powder', '1/2 tsp turmeric', 'Saffron strands', '1/4 cup warm milk', '4 tbsp ghee', 'Whole spices (bay leaf, cinnamon, cardamom)', 'Salt to taste'],
    steps: ['Marinate chicken with yogurt, ginger-garlic paste, spices for 30 min.', 'Soak rice for 30 minutes. Boil until 70% done.', 'Fry onions until golden brown. Reserve half for garnish.', 'Cook marinated chicken with fried onions until tender.', 'Soak saffron in warm milk.', 'Layer rice and chicken in heavy pot.', 'Pour saffron milk, ghee, mint, cilantro on top.', 'Cover and cook on dum (low heat) for 20-25 minutes.', 'Garnish with fried onions and serve with raita.'],
    nutrition: { calories: 520, protein: '32g', carbs: '58g', fat: '18g' }
  },
  {
    id: 2,
    title: 'Margherita Pizza',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '25 min',
    servings: '2 servings',
    difficulty: 'Easy',
    calories: 380,
    description: 'Classic Neapolitan pizza with tomato sauce, fresh mozzarella, basil, and olive oil. Simple perfection from Italy.',
    ingredients: ['1 pizza dough ball', '1/2 cup tomato sauce', '200g fresh mozzarella', 'Fresh basil leaves', '2 tbsp olive oil', '2 cloves garlic, minced', 'Salt to taste', 'Black pepper'],
    steps: ['Preheat oven to 475°F (245°C).', 'Roll out pizza dough into 12-inch circle.', 'Mix tomato sauce with garlic, salt, pepper.', 'Spread sauce on dough, leaving 1-inch border.', 'Tear mozzarella and distribute evenly.', 'Drizzle with olive oil.', 'Bake for 12-15 minutes until crust is golden.', 'Add fresh basil leaves and serve hot.'],
    nutrition: { calories: 380, protein: '18g', carbs: '45g', fat: '14g' }
  },
  {
    id: 3,
    title: 'Pad Thai',
    category: 'Thai',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '30 min',
    servings: '2 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Iconic Thai street food with stir-fried rice noodles, tamarind sauce, peanuts, and lime. Sweet, sour, and savory perfection.',
    ingredients: ['200g rice noodles', '200g shrimp or chicken', '2 eggs', '3 tbsp tamarind paste', '2 tbsp fish sauce', '1 tbsp sugar', '2 cloves garlic', '1/4 cup roasted peanuts', '2 cups bean sprouts', '3 green onions', 'Lime wedges', '2 tbsp vegetable oil', 'Red chili flakes'],
    steps: ['Soak rice noodles in warm water for 30 minutes.', 'Mix tamarind paste, fish sauce, and sugar for sauce.', 'Heat oil in wok, cook garlic and protein.', 'Push to side, scramble eggs.', 'Add drained noodles and sauce. Toss well.', 'Add bean sprouts and green onions. Stir-fry 2 minutes.', 'Top with peanuts and chili flakes.', 'Serve with lime wedges.'],
    nutrition: { calories: 420, protein: '24g', carbs: '52g', fat: '14g' }
  },
  {
    id: 4,
    title: 'Caesar Salad',
    category: 'American',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    rating: 4.5,
    time: '15 min',
    servings: '2 servings',
    difficulty: 'Easy',
    calories: 320,
    description: 'Classic salad with romaine lettuce, parmesan, croutons, and creamy Caesar dressing. A timeless favorite.',
    ingredients: ['1 head romaine lettuce', '1/2 cup parmesan cheese, shaved', '1 cup croutons', '2 egg yolks', '2 cloves garlic', '2 tsp Dijon mustard', '2 tsp Worcestershire sauce', '1/2 cup olive oil', '2 tbsp lemon juice', '4 anchovy fillets', 'Salt and pepper'],
    steps: ['Wash and chop romaine lettuce.', 'Blend garlic, anchovies, egg yolks, mustard, Worcestershire.', 'Slowly add olive oil while blending.', 'Add lemon juice, salt, pepper. Mix well.', 'Toss lettuce with dressing.', 'Add croutons and parmesan.', 'Serve immediately.'],
    nutrition: { calories: 320, protein: '12g', carbs: '18g', fat: '24g' }
  },
  {
    id: 5,
    title: 'Sushi Rolls',
    category: 'Japanese',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '45 min',
    servings: '3 servings',
    difficulty: 'Hard',
    calories: 280,
    description: 'Traditional Japanese rice rolls with fresh fish, vegetables, and nori seaweed. An art form in every bite.',
    ingredients: ['2 cups sushi rice', '3 tbsp rice vinegar', '1 tbsp sugar', '1 tsp salt', '4 nori sheets', '200g sashimi-grade fish', '1 cucumber', '1 avocado', 'Soy sauce', 'Wasabi', 'Pickled ginger', 'Sesame seeds'],
    steps: ['Cook sushi rice, let cool slightly.', 'Mix vinegar, sugar, salt. Fold into rice.', 'Place nori on bamboo mat.', 'Spread rice evenly, leaving 1-inch border.', 'Add fish, cucumber, avocado in a line.', 'Roll tightly using bamboo mat.', 'Cut into 8 pieces with wet knife.', 'Serve with soy sauce, wasabi, ginger.'],
    nutrition: { calories: 280, protein: '14g', carbs: '48g', fat: '4g' }
  },
  {
    id: 6,
    title: 'Tacos al Pastor',
    category: 'Mexican',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '40 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 380,
    description: 'Mexican street tacos with marinated pork, pineapple, and fresh toppings. A flavor explosion from Mexico City.',
    ingredients: ['500g pork shoulder, thinly sliced', '3 dried guajillo chilies', '2 cloves garlic', '1/4 cup pineapple juice', '2 tbsp vinegar', '1 tsp cumin', '1 tsp oregano', 'Fresh pineapple chunks', '12 corn tortillas', 'Onion, diced', 'Cilantro', 'Lime wedges', 'Salsa'],
    steps: ['Rehydrate chilies in hot water.', 'Blend chilies, garlic, pineapple juice, vinegar, spices.', 'Marinate pork for 2 hours or overnight.', 'Cook pork in hot skillet until caramelized.', 'Grill pineapple chunks.', 'Warm tortillas on griddle.', 'Assemble tacos with pork, pineapple, onion, cilantro.', 'Serve with lime and salsa.'],
    nutrition: { calories: 380, protein: '28g', carbs: '35g', fat: '14g' }
  },
  {
    id: 7,
    title: 'Greek Moussaka',
    category: 'Greek',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '120 min',
    servings: '6 servings',
    difficulty: 'Hard',
    calories: 480,
    description: 'Layered casserole with eggplant, spiced meat sauce, and creamy béchamel. A Greek comfort food classic.',
    ingredients: ['3 eggplants, sliced', '500g ground lamb', '2 onions, chopped', '3 cloves garlic', '1 can crushed tomatoes', '1/4 cup red wine', '1 tsp cinnamon', '4 tbsp butter', '4 tbsp flour', '2 cups milk', '2 eggs', '1 cup parmesan', 'Olive oil', 'Salt and pepper'],
    steps: ['Slice and salt eggplant. Let sit 30 minutes, rinse.', 'Brush eggplant with oil, bake at 400°F until golden.', 'Cook lamb with onions and garlic until browned.', 'Add tomatoes, wine, cinnamon. Simmer 20 minutes.', 'Make béchamel: melt butter, add flour, gradually add milk.', 'Remove from heat, whisk in eggs and half the cheese.', 'Layer eggplant, meat sauce, repeat. Top with béchamel.', 'Sprinkle remaining cheese. Bake 45 minutes at 350°F.'],
    nutrition: { calories: 480, protein: '26g', carbs: '32g', fat: '28g' }
  },
  {
    id: 8,
    title: 'Tom Yum Soup',
    category: 'Thai',
    image: 'https://images.unsplash.com/photo-1547928576-262e9d580d60?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '25 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 180,
    description: 'Hot and sour Thai soup with shrimp, lemongrass, and lime leaves. Aromatic and refreshing.',
    ingredients: ['400g shrimp, peeled', '4 cups chicken stock', '3 stalks lemongrass', '4 kaffir lime leaves', '3 Thai chilies', '200g mushrooms', '3 tbsp fish sauce', '2 tbsp lime juice', '1 tbsp chili paste', '2 tomatoes, quartered', 'Cilantro for garnish'],
    steps: ['Bruise lemongrass stalks.', 'Bring stock to boil with lemongrass, lime leaves, chilies.', 'Add mushrooms, simmer 5 minutes.', 'Add shrimp and tomatoes, cook until shrimp pink.', 'Stir in fish sauce, lime juice, chili paste.', 'Remove from heat.', 'Garnish with cilantro and serve hot.'],
    nutrition: { calories: 180, protein: '22g', carbs: '12g', fat: '4g' }
  },
  {
    id: 9,
    title: 'Beef Burger',
    category: 'American',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '20 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 550,
    description: 'Classic American burger with juicy beef patty, cheese, and all the fixings. The ultimate comfort food.',
    ingredients: ['600g ground beef (80/20)', '4 burger buns', '4 cheese slices', 'Lettuce leaves', '2 tomatoes, sliced', '1 onion, sliced', 'Pickles', 'Ketchup', 'Mustard', 'Mayo', 'Salt and pepper', '1 tbsp butter'],
    steps: ['Divide beef into 4 patties, season with salt and pepper.', 'Heat skillet or grill to high.', 'Cook patties 4 minutes per side for medium.', 'Add cheese in last minute, cover to melt.', 'Toast buns with butter.', 'Spread mayo and mustard on buns.', 'Layer lettuce, tomato, patty with cheese, onion, pickles.', 'Add ketchup and serve immediately.'],
    nutrition: { calories: 550, protein: '32g', carbs: '38g', fat: '30g' }
  },
  {
    id: 10,
    title: 'Chicken Tikka Masala',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    rating: 4.9,
    time: '50 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Creamy tomato-based curry with grilled chicken tikka. Britain\'s favorite Indian dish.',
    ingredients: ['600g chicken breast', '1 cup yogurt', '2 tbsp tikka masala spice', '2 tbsp ginger-garlic paste', '2 onions, chopped', '4 tomatoes, pureed', '1 cup heavy cream', '2 tsp garam masala', '1 tsp turmeric', '1 tsp red chili powder', '3 tbsp butter', '2 tbsp oil', 'Kasuri methi', 'Cilantro', 'Salt'],
    steps: ['Marinate chicken with yogurt, 1 tbsp tikka spice, ginger-garlic for 2 hours.', 'Grill or bake chicken until charred. Cut into pieces.', 'Heat butter and oil, sauté onions until golden.', 'Add remaining spices, cook 2 minutes.', 'Add tomato puree, cook until oil separates.', 'Add cream, simmer 5 minutes.', 'Add grilled chicken, kasuri methi. Simmer 10 minutes.', 'Garnish with cilantro, serve with naan or rice.'],
    nutrition: { calories: 420, protein: '36g', carbs: '18g', fat: '24g' }
  },
  {
    id: 11,
    title: 'Spaghetti Carbonara',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '20 min',
    servings: '2 servings',
    difficulty: 'Medium',
    calories: 520,
    description: 'Roman pasta with eggs, cheese, pancetta, and black pepper. Creamy without cream.',
    ingredients: ['300g spaghetti', '150g pancetta or guanciale', '3 egg yolks', '1 whole egg', '1 cup pecorino romano, grated', '1/2 cup parmesan, grated', 'Black pepper', 'Salt', 'Pasta water'],
    steps: ['Cook spaghetti in salted water until al dente. Reserve 1 cup pasta water.', 'Cut pancetta into small pieces, cook until crispy.', 'Whisk eggs, pecorino, parmesan, and lots of black pepper.', 'Drain pasta, add to pancetta pan off heat.', 'Quickly add egg mixture, toss vigorously.', 'Add pasta water gradually to create creamy sauce.', 'Serve immediately with extra cheese and pepper.'],
    nutrition: { calories: 520, protein: '28g', carbs: '54g', fat: '22g' }
  },
  {
    id: 12,
    title: 'Pho Bo',
    category: 'Vietnamese',
    image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '180 min',
    servings: '4 servings',
    difficulty: 'Hard',
    calories: 380,
    description: 'Vietnamese beef noodle soup with aromatic broth, rice noodles, and fresh herbs. Soul-warming comfort.',
    ingredients: ['1kg beef bones', '500g beef brisket', '300g rice noodles', '2 onions, halved', '4-inch ginger', '2 cinnamon sticks', '3 star anise', '4 cloves', '1 tbsp coriander seeds', '2 tbsp fish sauce', 'Rock sugar', 'Bean sprouts', 'Fresh basil', 'Lime wedges', 'Sliced chilies', 'Hoisin sauce', 'Sriracha'],
    steps: ['Char onions and ginger over flame until blackened.', 'Blanch bones in boiling water 5 minutes, rinse.', 'Toast spices in dry pan until fragrant.', 'Simmer bones, brisket, onions, ginger, spices for 3 hours.', 'Remove brisket after 40 minutes, let cool.', 'Strain broth, season with fish sauce and sugar.', 'Soak rice noodles until soft. Slice brisket thinly.', 'Assemble: noodles, brisket, hot broth, garnish with herbs, lime, chilies.'],
    nutrition: { calories: 380, protein: '28g', carbs: '48g', fat: '8g' }
  },
  {
    id: 13,
    title: 'Falafel Wrap',
    category: 'Middle Eastern',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '35 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Crispy chickpea fritters in pita with tahini sauce and fresh vegetables. Middle Eastern street food favorite.',
    ingredients: ['2 cups dried chickpeas (soaked overnight)', '1 onion, chopped', '4 cloves garlic', '1 cup parsley', '1 cup cilantro', '1 tsp cumin', '1 tsp coriander', '1/4 tsp cayenne', '1 tsp baking powder', '4 pita breads', 'Tahini sauce', 'Lettuce', 'Tomatoes', 'Cucumber', 'Pickles', 'Oil for frying'],
    steps: ['Drain soaked chickpeas thoroughly.', 'Blend chickpeas, onion, garlic, herbs, spices until coarse.', 'Add baking powder, mix. Refrigerate 1 hour.', 'Form into small balls.', 'Heat oil to 350°F. Fry falafel until golden brown.', 'Warm pita breads.', 'Fill with lettuce, tomatoes, cucumber, falafel.', 'Drizzle with tahini sauce and serve.'],
    nutrition: { calories: 420, protein: '16g', carbs: '58g', fat: '14g' }
  },
  {
    id: 14,
    title: 'Beef Bulgogi',
    category: 'Korean',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '40 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 360,
    description: 'Korean marinated beef BBQ with sweet and savory flavors. Tender and delicious.',
    ingredients: ['600g beef ribeye, thinly sliced', '1/3 cup soy sauce', '3 tbsp sugar', '2 tbsp sesame oil', '4 cloves garlic, minced', '1 pear, grated', '2 green onions, chopped', '1 tbsp ginger, minced', '1 tbsp sesame seeds', 'Black pepper', 'Lettuce leaves', 'Steamed rice'],
    steps: ['Mix soy sauce, sugar, sesame oil, garlic, pear, ginger.', 'Add beef slices, marinate 30 minutes minimum.', 'Heat skillet or grill to high heat.', 'Cook beef in batches, don\'t overcrowd.', 'Cook 2-3 minutes until caramelized.', 'Sprinkle with sesame seeds and green onions.', 'Serve with lettuce wraps and rice.'],
    nutrition: { calories: 360, protein: '32g', carbs: '18g', fat: '18g' }
  },
  {
    id: 15,
    title: 'Shakshuka',
    category: 'Middle Eastern',
    image: 'https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '30 min',
    servings: '3 servings',
    difficulty: 'Easy',
    calories: 280,
    description: 'North African eggs poached in spiced tomato sauce. Perfect for breakfast or brunch.',
    ingredients: ['6 eggs', '1 can crushed tomatoes', '2 bell peppers, diced', '1 onion, chopped', '4 cloves garlic', '1 tsp cumin', '1 tsp paprika', '1/4 tsp cayenne', '2 tbsp olive oil', 'Feta cheese', 'Fresh parsley', 'Crusty bread', 'Salt and pepper'],
    steps: ['Heat olive oil, sauté onions and peppers until soft.', 'Add garlic, cumin, paprika, cayenne. Cook 1 minute.', 'Add crushed tomatoes, simmer 10 minutes.', 'Season sauce with salt and pepper.', 'Make 6 wells in sauce, crack eggs into each.', 'Cover and cook until eggs are set (5-7 minutes).', 'Top with feta and parsley.', 'Serve with crusty bread for dipping.'],
    nutrition: { calories: 280, protein: '16g', carbs: '22g', fat: '14g' }
  },
  {
    id: 16,
    title: 'Ramen',
    category: 'Japanese',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    rating: 4.9,
    time: '60 min',
    servings: '2 servings',
    difficulty: 'Hard',
    calories: 480,
    description: 'Japanese noodle soup with rich broth, tender pork, and perfect toppings. Comfort in a bowl.',
    ingredients: ['400g fresh ramen noodles', '4 cups chicken/pork broth', '2 tbsp miso paste', '2 tbsp soy sauce', '1 tbsp sesame oil', '300g pork belly', '4 soft-boiled eggs', '2 sheets nori', '2 green onions', 'Bamboo shoots', 'Bean sprouts', 'Corn kernels', 'Nori sheets'],
    steps: ['Marinate pork belly in soy sauce, roast at 300°F for 2 hours.', 'Bring broth to simmer, add miso and soy sauce.', 'Cook ramen noodles according to package.', 'Soft boil eggs for 6.5 minutes, peel and halve.', 'Slice pork belly thinly.', 'Divide noodles into bowls, ladle hot broth.', 'Top with pork, egg, green onions, bamboo, nori.', 'Drizzle with sesame oil and serve.'],
    nutrition: { calories: 480, protein: '28g', carbs: '52g', fat: '18g' }
  },
  {
    id: 17,
    title: 'Chicken Alfredo',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '25 min',
    servings: '3 servings',
    difficulty: 'Easy',
    calories: 580,
    description: 'Creamy pasta with grilled chicken and parmesan cheese. Rich and indulgent.',
    ingredients: ['300g fettuccine', '2 chicken breasts', '1 cup heavy cream', '1/2 cup butter', '1.5 cups parmesan, grated', '4 cloves garlic, minced', 'Salt and pepper', 'Italian seasoning', 'Fresh parsley', 'Olive oil'],
    steps: ['Season chicken with salt, pepper, Italian seasoning. Grill until cooked.', 'Cook pasta until al dente.', 'Melt butter in large pan, sauté garlic.', 'Add heavy cream, bring to simmer.', 'Stir in parmesan cheese gradually until melted.', 'Add drained pasta, toss to coat.', 'Slice chicken, place on pasta.', 'Garnish with parsley and extra parmesan.'],
    nutrition: { calories: 580, protein: '36g', carbs: '48g', fat: '28g' }
  },
  {
    id: 18,
    title: 'Fish Tacos',
    category: 'Mexican',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '30 min',
    servings: '3 servings',
    difficulty: 'Easy',
    calories: 380,
    description: 'Crispy battered fish in corn tortillas with cabbage slaw and creamy sauce. Baja California classic.',
    ingredients: ['500g white fish fillets', '1 cup flour', '1 tsp baking powder', '1 cup beer', '8 corn tortillas', '2 cups shredded cabbage', '1/2 cup mayo', '2 tbsp lime juice', '1 tbsp sriracha', 'Cilantro', 'Lime wedges', 'Oil for frying', 'Salt and pepper'],
    steps: ['Mix mayo, lime juice, sriracha for sauce.', 'Toss cabbage with half the sauce.', 'Mix flour, baking powder, salt. Add beer to make batter.', 'Heat oil to 375°F.', 'Dip fish in batter, fry until golden (3-4 minutes).', 'Warm tortillas on griddle.', 'Place fish in tortillas, top with slaw.', 'Add sauce, cilantro, lime. Serve immediately.'],
    nutrition: { calories: 380, protein: '28g', carbs: '36g', fat: '14g' }
  },
  {
    id: 19,
    title: 'Lamb Gyros',
    category: 'Greek',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '35 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 450,
    description: 'Greek spiced lamb in pita with tzatziki sauce, tomatoes, and onions. Mediterranean perfection.',
    ingredients: ['600g ground lamb', '4 pita breads', '1 onion, grated', '4 cloves garlic, minced', '1 tsp cumin', '1 tsp oregano', '1 tsp paprika', '1 cup Greek yogurt', '1 cucumber, grated', '2 tbsp dill', '2 tomatoes, sliced', 'Red onion, sliced', 'Lettuce', 'Lemon juice', 'Olive oil'],
    steps: ['Mix lamb with grated onion, garlic, cumin, oregano, paprika.', 'Form into patties or kebabs.', 'Grill or pan-fry until cooked through.', 'Make tzatziki: mix yogurt, cucumber, dill, lemon juice, salt.', 'Warm pita breads.', 'Spread tzatziki on pita.', 'Add lamb, tomatoes, onion, lettuce.', 'Fold and serve with extra tzatziki.'],
    nutrition: { calories: 450, protein: '32g', carbs: '38g', fat: '20g' }
  },
  {
    id: 20,
    title: 'Bibimbap',
    category: 'Korean',
    image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '40 min',
    servings: '2 servings',
    difficulty: 'Medium',
    calories: 520,
    description: 'Korean rice bowl with vegetables, beef, egg, and gochujang. Colorful and nutritious.',
    ingredients: ['2 cups cooked rice', '200g beef, thinly sliced', '1 carrot, julienned', '1 zucchini, julienned', '200g spinach', '200g bean sprouts', '2 eggs', '3 tbsp gochujang', '2 tbsp sesame oil', '2 tbsp soy sauce', '1 tbsp sugar', 'Sesame seeds', 'Garlic', 'Vegetable oil'],
    steps: ['Marinate beef with soy sauce, sesame oil, garlic.', 'Blanch spinach and bean sprouts separately. Season with sesame oil.', 'Sauté carrot and zucchini separately until tender.', 'Cook beef until browned.', 'Fry eggs sunny-side up.', 'Place rice in bowls, arrange vegetables and beef in sections.', 'Top with fried egg and gochujang.', 'Mix everything together before eating. Sprinkle sesame seeds.'],
    nutrition: { calories: 520, protein: '28g', carbs: '62g', fat: '18g' }
  },
  {
    id: 21,
    title: 'Chicken Fajitas',
    category: 'Mexican',
    image: 'https://images.unsplash.com/photo-1599974982056-def8f6f0e1f1?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '25 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 380,
    description: 'Sizzling chicken and peppers in warm tortillas. A Tex-Mex favorite perfect for sharing.',
    ingredients: ['500g chicken breast, sliced', '3 bell peppers, sliced', '2 onions, sliced', '3 tbsp fajita seasoning', '2 tbsp lime juice', '8 flour tortillas', 'Sour cream', 'Guacamole', 'Salsa', 'Shredded cheese', 'Cilantro', '2 tbsp vegetable oil'],
    steps: ['Toss chicken with fajita seasoning and lime juice.', 'Heat oil in large skillet over high heat.', 'Cook chicken until browned, remove.', 'Sauté peppers and onions until charred.', 'Return chicken to pan, toss together.', 'Warm tortillas in dry pan or microwave.', 'Serve chicken mixture with tortillas.', 'Top with sour cream, guacamole, salsa, cheese, cilantro.'],
    nutrition: { calories: 380, protein: '32g', carbs: '42g', fat: '10g' }
  },
  {
    id: 22,
    title: 'Kothu Parotta',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '30 min',
    servings: '3 servings',
    difficulty: 'Medium',
    calories: 450,
    description: 'Popular Tamil street food made by shredding layered parotta and stir-frying with eggs, spices, and curry.',
    ingredients: ['4 ready-made parottas', '3 eggs', '1 onion, chopped', '2 tomatoes, chopped', '2 green chilies, chopped', '1 tbsp ginger-garlic paste', '2 tsp egg masala', '1/2 tsp turmeric', '1 tsp red chili powder', '10 curry leaves', '1/4 cup salna/curry gravy', '2 tbsp oil', 'Salt to taste', 'Fresh cilantro'],
    steps: ['Cook parottas on tawa. Tear/chop into small pieces.', 'Heat oil, add curry leaves, onions, green chilies. Sauté.', 'Add ginger-garlic paste, cook 1 minute.', 'Add tomatoes, turmeric, chili powder, masala. Cook until soft.', 'Push to side, crack eggs, scramble.', 'Add torn parotta pieces. Mix everything.', 'Add salna/gravy. Chop and mix with two spatulas.', 'Garnish with cilantro. Serve hot with raita or salna.'],
    nutrition: { calories: 450, protein: '16g', carbs: '52g', fat: '20g' }
  },
  {
    id: 23,
    title: 'Paella',
    category: 'Spanish',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&fit=crop',
    rating: 4.9,
    time: '60 min',
    servings: '6 servings',
    difficulty: 'Hard',
    calories: 480,
    description: 'Spanish rice dish with seafood, chicken, and saffron. A celebration on a plate from Valencia.',
    ingredients: ['2 cups paella rice', '300g shrimp', '300g mussels', '2 chicken thighs, cubed', '1 chorizo, sliced', '1 onion, diced', '4 cloves garlic', '1 red bell pepper', '4 cups chicken stock', 'Saffron threads', '1 cup peas', '1 lemon', 'Paprika', 'Olive oil', 'Salt and pepper', 'Fresh parsley'],
    steps: ['Steep saffron in warm stock.', 'Heat paella pan, cook chicken and chorizo. Remove.', 'Sauté onion, garlic, bell pepper.', 'Add rice, toast 2 minutes.', 'Add saffron stock, paprika. Don\'t stir.', 'Arrange chicken, chorizo on top. Simmer 15 minutes.', 'Add shrimp, mussels, peas. Cook until seafood done.', 'Let rest 5 minutes. Garnish with lemon and parsley.'],
    nutrition: { calories: 480, protein: '34g', carbs: '56g', fat: '14g' }
  },
  {
    id: 24,
    title: 'Massaman Curry',
    category: 'Thai',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '50 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Rich Thai curry with peanuts, potatoes, and tender beef. Sweet, savory, and mildly spiced.',
    ingredients: ['500g beef chuck, cubed', '3 tbsp massaman curry paste', '1 can coconut milk', '2 potatoes, cubed', '1 onion, sliced', '1/2 cup roasted peanuts', '2 tbsp fish sauce', '2 tbsp palm sugar', '3 cardamom pods', '1 cinnamon stick', '2 bay leaves', 'Tamarind paste', 'Jasmine rice'],
    steps: ['Heat coconut cream (top of can), fry curry paste 2 minutes.', 'Add beef, brown on all sides.', 'Add remaining coconut milk, cardamom, cinnamon, bay leaves.', 'Simmer 30 minutes until beef tender.', 'Add potatoes, cook until soft.', 'Add onion, peanuts, fish sauce, sugar, tamarind.', 'Simmer 10 more minutes.', 'Serve over jasmine rice.'],
    nutrition: { calories: 420, protein: '28g', carbs: '38g', fat: '18g' }
  },
  {
    id: 25,
    title: 'Peking Duck',
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1583878906986-de5c2779e90e?w=400&h=300&fit=crop',
    rating: 4.9,
    time: '240 min',
    servings: '4 servings',
    difficulty: 'Hard',
    calories: 520,
    description: 'Crispy-skinned duck served with pancakes, scallions, and hoisin sauce. A Chinese delicacy.',
    ingredients: ['1 whole duck (2kg)', '2 tbsp maltose/honey', '2 tbsp rice vinegar', '1 tsp five-spice powder', '12 Mandarin pancakes', '6 scallions, julienned', '1 cucumber, julienned', 'Hoisin sauce', 'Soy sauce', 'Ginger'],
    steps: ['Clean duck, blanch in boiling water 1 minute.', 'Pat dry completely. Air-dry in fridge overnight.', 'Mix maltose, vinegar, five-spice. Brush on duck.', 'Roast at 350°F for 1 hour, then 400°F for 30 minutes.', 'Let rest 10 minutes. Carve skin separately from meat.', 'Steam pancakes until warm.', 'Spread hoisin on pancake, add duck, scallions, cucumber.', 'Roll and serve immediately.'],
    nutrition: { calories: 520, protein: '38g', carbs: '32g', fat: '26g' }
  },
  {
    id: 26,
    title: 'Croissant',
    category: 'French',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '480 min',
    servings: '8 servings',
    difficulty: 'Hard',
    calories: 320,
    description: 'Flaky, buttery French pastry with countless layers. A breakfast masterpiece.',
    ingredients: ['500g bread flour', '60g sugar', '10g salt', '10g instant yeast', '300ml milk', '250g cold butter', '1 egg for wash'],
    steps: ['Mix flour, sugar, salt, yeast. Add milk, knead to dough.', 'Rest dough in fridge 1 hour.', 'Pound butter into 8x8 inch square.', 'Roll dough to 16x8 inches, place butter on half.', 'Fold over, seal edges. Roll and fold 3 times.', 'Rest 30 minutes between folds.', 'Roll out, cut into triangles, roll into crescents.', 'Proof 2 hours, brush with egg, bake at 400°F for 15 minutes.'],
    nutrition: { calories: 320, protein: '7g', carbs: '38g', fat: '16g' }
  },
  {
    id: 27,
    title: 'Pulled Pork Sandwich',
    category: 'American',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '360 min',
    servings: '8 servings',
    difficulty: 'Medium',
    calories: 480,
    description: 'Slow-cooked pork shoulder with BBQ sauce on a bun with coleslaw. Southern comfort food.',
    ingredients: ['2kg pork shoulder', '1/4 cup brown sugar', '2 tbsp paprika', '1 tbsp garlic powder', '1 tbsp onion powder', '1 tsp cayenne', '2 cups BBQ sauce', '1 cup apple cider vinegar', '8 burger buns', 'Coleslaw', 'Pickles', 'Salt and pepper'],
    steps: ['Mix brown sugar, paprika, garlic powder, onion powder, cayenne, salt, pepper.', 'Rub all over pork shoulder.', 'Place in slow cooker with vinegar and 1 cup BBQ sauce.', 'Cook on low for 8 hours until tender.', 'Shred pork with forks.', 'Mix with remaining BBQ sauce.', 'Toast buns, pile with pulled pork.', 'Top with coleslaw and pickles.'],
    nutrition: { calories: 480, protein: '36g', carbs: '42g', fat: '18g' }
  },
  {
    id: 28,
    title: 'Lasagna',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '90 min',
    servings: '8 servings',
    difficulty: 'Medium',
    calories: 520,
    description: 'Layered pasta with meat sauce, ricotta, and mozzarella. Italian comfort food at its finest.',
    ingredients: ['12 lasagna noodles', '500g ground beef', '1 onion, diced', '4 cloves garlic', '2 cans crushed tomatoes', '2 tbsp tomato paste', '2 tsp Italian seasoning', '500g ricotta cheese', '2 eggs', '3 cups mozzarella, shredded', '1 cup parmesan, grated', 'Fresh basil', 'Olive oil', 'Salt and pepper'],
    steps: ['Cook lasagna noodles, drain and lay flat.', 'Brown beef with onion and garlic. Add tomatoes, paste, seasoning. Simmer 20 minutes.', 'Mix ricotta with eggs, 1 cup mozzarella, 1/2 cup parmesan, basil.', 'Spread sauce in 9x13 pan. Layer noodles, ricotta mixture, sauce, mozzarella.', 'Repeat layers twice.', 'Top with remaining mozzarella and parmesan.', 'Cover with foil, bake at 375°F for 25 minutes.', 'Uncover, bake 25 more minutes. Let rest 15 minutes.'],
    nutrition: { calories: 520, protein: '32g', carbs: '42g', fat: '24g' }
  },
  {
    id: 29,
    title: 'Chicken Satay',
    category: 'Thai',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '40 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 350,
    description: 'Grilled chicken skewers with peanut sauce. Perfect Thai appetizer or main course.',
    ingredients: ['600g chicken thighs, cubed', '2 tbsp curry powder', '1 tsp turmeric', '2 tbsp fish sauce', '2 tbsp brown sugar', '1 can coconut milk', '1/2 cup peanut butter', '2 tbsp lime juice', '2 tbsp soy sauce', '1 tbsp sriracha', 'Bamboo skewers', 'Cucumber slices', 'Red onion'],
    steps: ['Soak skewers in water 30 minutes.', 'Mix curry powder, turmeric, fish sauce, sugar, half coconut milk.', 'Marinate chicken 30 minutes.', 'Thread chicken on skewers.', 'Make peanut sauce: simmer remaining coconut milk, peanut butter, lime juice, soy sauce, sriracha.', 'Grill skewers 3-4 minutes per side.', 'Serve with peanut sauce, cucumber, onion.'],
    nutrition: { calories: 350, protein: '32g', carbs: '14g', fat: '20g' }
  },
  {
    id: 30,
    title: 'Beef Wellington',
    category: 'British',
    image: 'https://images.unsplash.com/photo-1632329933864-27e574dc5f0d?w=400&h=300&fit=crop',
    rating: 4.9,
    time: '120 min',
    servings: '4 servings',
    difficulty: 'Hard',
    calories: 680,
    description: 'Beef tenderloin wrapped in mushroom duxelles and puff pastry. An elegant British classic.',
    ingredients: ['800g beef tenderloin', '500g puff pastry', '300g mushrooms, finely chopped', '4 slices prosciutto', '2 tbsp Dijon mustard', '2 shallots, minced', '2 cloves garlic', '2 tbsp butter', '1 egg, beaten', 'Fresh thyme', 'Salt and pepper', 'Olive oil'],
    steps: ['Season beef, sear all sides in hot pan until browned. Cool.', 'Cook mushrooms, shallots, garlic in butter until dry. Add thyme.', 'Brush beef with mustard.', 'Lay prosciutto, spread mushroom mixture, place beef on top.', 'Wrap tightly in plastic wrap, chill 20 minutes.', 'Roll puff pastry, wrap around beef. Seal edges.', 'Brush with egg wash, score pattern.', 'Bake at 400°F for 25-30 minutes until golden.', 'Rest 10 minutes before slicing.'],
    nutrition: { calories: 680, protein: '42g', carbs: '38g', fat: '40g' }
  },
  {
    id: 31,
    title: 'Ceviche',
    category: 'Peruvian',
    image: 'https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '30 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 180,
    description: 'Fresh fish "cooked" in citrus juice with onions and chilies. Refreshing Peruvian classic.',
    ingredients: ['500g fresh white fish, diced', '1 cup lime juice', '1 red onion, thinly sliced', '2 jalapeños, sliced', '1 sweet potato, boiled and sliced', '1 cup corn kernels', 'Fresh cilantro', '1 tsp aji amarillo paste', 'Salt', 'Tortilla chips'],
    steps: ['Cut fish into small cubes, season with salt.', 'Cover fish completely with lime juice.', 'Refrigerate 15-20 minutes until fish turns opaque.', 'Soak onion in cold water to reduce bite.', 'Drain fish, reserving some lime juice.', 'Mix fish with onion, jalapeños, aji paste, cilantro.', 'Add back some lime juice to taste.', 'Serve with sweet potato, corn, and tortilla chips.'],
    nutrition: { calories: 180, protein: '24g', carbs: '18g', fat: '2g' }
  },
  {
    id: 32,
    title: 'Chicken Parmigiana',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '45 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 520,
    description: 'Breaded chicken topped with marinara and melted cheese. Italian-American comfort classic.',
    ingredients: ['4 chicken breasts', '2 cups marinara sauce', '2 cups mozzarella, shredded', '1/2 cup parmesan, grated', '2 eggs', '2 cups breadcrumbs', '1 cup flour', 'Italian seasoning', 'Garlic powder', 'Fresh basil', 'Olive oil', 'Salt and pepper', 'Spaghetti'],
    steps: ['Pound chicken to even thickness.', 'Set up breading station: flour, beaten eggs, breadcrumbs mixed with parmesan and seasonings.', 'Coat chicken: flour, egg, breadcrumbs.', 'Pan-fry in olive oil until golden both sides.', 'Place in baking dish, top with marinara and mozzarella.', 'Bake at 400°F until cheese melted and bubbly.', 'Garnish with basil and parmesan.', 'Serve over spaghetti.'],
    nutrition: { calories: 520, protein: '42g', carbs: '38g', fat: '22g' }
  },
  {
    id: 33,
    title: 'Pad See Ew',
    category: 'Thai',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '25 min',
    servings: '2 servings',
    difficulty: 'Easy',
    calories: 440,
    description: 'Thai stir-fried wide rice noodles with dark soy sauce and Chinese broccoli. Street food favorite.',
    ingredients: ['300g wide rice noodles', '200g chicken or beef, sliced', '2 eggs', '3 cups Chinese broccoli', '4 cloves garlic, minced', '3 tbsp dark soy sauce', '1 tbsp light soy sauce', '1 tbsp oyster sauce', '1 tbsp sugar', '2 tbsp vegetable oil', 'White pepper'],
    steps: ['Soak rice noodles until soft, drain.', 'Heat wok on high, add oil and garlic.', 'Add meat, cook until done. Push aside.', 'Crack eggs, scramble.', 'Add noodles, both soy sauces, oyster sauce, sugar.', 'Toss quickly over high heat.', 'Add Chinese broccoli, stir-fry until wilted.', 'Season with white pepper, serve hot.'],
    nutrition: { calories: 440, protein: '26g', carbs: '58g', fat: '12g' }
  },
  {
    id: 34,
    title: 'Chicken Korma',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '50 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Mild, creamy Indian curry with chicken, yogurt, and ground nuts. Rich Mughlai cuisine.',
    ingredients: ['600g chicken, cubed', '1 cup yogurt', '1/2 cup cashews', '1/4 cup almonds', '2 onions, sliced', '2 tbsp ginger-garlic paste', '1 tsp garam masala', '1/2 tsp turmeric', '4 green cardamoms', '1 cinnamon stick', '1/2 cup cream', '3 tbsp ghee', 'Saffron strands', 'Salt', 'Fresh cilantro'],
    steps: ['Soak cashews and almonds, blend to paste.', 'Marinate chicken in yogurt, ginger-garlic paste, turmeric.', 'Heat ghee, fry whole spices until fragrant.', 'Add onions, cook until golden brown.', 'Add marinated chicken, cook 5 minutes.', 'Add nut paste, cook stirring constantly.', 'Add cream and saffron, simmer until chicken tender.', 'Garnish with cilantro, serve with naan.'],
    nutrition: { calories: 420, protein: '34g', carbs: '18g', fat: '26g' }
  },
  {
    id: 35,
    title: 'Banh Mi',
    category: 'Vietnamese',
    image: 'https://images.unsplash.com/photo-1591814483164-e3d9e1d89809?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '40 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 380,
    description: 'Vietnamese sandwich with pâté, pickled vegetables, cilantro, and grilled pork on crispy baguette.',
    ingredients: ['4 small baguettes', '300g pork tenderloin', '2 tbsp soy sauce', '2 tbsp fish sauce', '1 tbsp honey', '2 tbsp lemongrass, minced', '1 carrot, julienned', '1 daikon, julienned', '1/4 cup vinegar', '2 tbsp sugar', 'Pâté', 'Cucumber, sliced', 'Jalapeños', 'Fresh cilantro', 'Mayonnaise'],
    steps: ['Marinate pork with soy sauce, fish sauce, honey, lemongrass. Grill or pan-fry.', 'Quick pickle carrot and daikon in vinegar and sugar for 30 minutes.', 'Slice baguettes, toast until crispy.', 'Spread pâté and mayo inside baguettes.', 'Layer pork, pickled vegetables, cucumber, jalapeños.', 'Top with cilantro.', 'Serve immediately while bread is crispy.'],
    nutrition: { calories: 380, protein: '24g', carbs: '42g', fat: '12g' }
  },
  {
    id: 36,
    title: 'Shepherd\'s Pie',
    category: 'British',
    image: 'https://images.unsplash.com/photo-1621889976646-b64d4ee56ec8?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '60 min',
    servings: '6 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Ground lamb with vegetables topped with creamy mashed potatoes. British comfort food classic.',
    ingredients: ['600g ground lamb', '1kg potatoes', '2 carrots, diced', '1 onion, diced', '2 cloves garlic', '1 cup peas', '2 tbsp tomato paste', '1 cup beef stock', '1/2 cup milk', '4 tbsp butter', 'Worcestershire sauce', 'Fresh thyme', 'Shredded cheddar', 'Salt and pepper'],
    steps: ['Boil potatoes until tender, mash with butter, milk, salt.', 'Brown lamb in large pan, drain excess fat.', 'Add onion, carrots, garlic. Cook until soft.', 'Stir in tomato paste, stock, Worcestershire, thyme.', 'Simmer 15 minutes. Add peas.', 'Transfer to baking dish.', 'Spread mashed potatoes on top, sprinkle cheese.', 'Bake at 400°F for 25 minutes until golden.'],
    nutrition: { calories: 420, protein: '26g', carbs: '38g', fat: '18g' }
  },
  {
    id: 37,
    title: 'Kung Pao Chicken',
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '25 min',
    servings: '3 servings',
    difficulty: 'Easy',
    calories: 380,
    description: 'Spicy Sichuan stir-fry with chicken, peanuts, and dried chilies. Bold and flavorful.',
    ingredients: ['500g chicken breast, cubed', '1/2 cup roasted peanuts', '10 dried red chilies', '1 bell pepper, cubed', '3 green onions, chopped', '3 cloves garlic, minced', '1 tbsp ginger, minced', '2 tbsp soy sauce', '1 tbsp rice vinegar', '1 tbsp hoisin sauce', '1 tsp sugar', '1 tsp cornstarch', '2 tbsp vegetable oil', 'Sichuan peppercorns'],
    steps: ['Mix soy sauce, vinegar, hoisin, sugar, cornstarch for sauce.', 'Marinate chicken in half the sauce.', 'Heat oil in wok, toast Sichuan peppercorns and chilies.', 'Add chicken, stir-fry until cooked. Remove.', 'Stir-fry garlic, ginger, bell pepper.', 'Return chicken, add remaining sauce.', 'Toss in peanuts and green onions.', 'Serve over rice.'],
    nutrition: { calories: 380, protein: '36g', carbs: '22g', fat: '18g' }
  },
  {
    id: 38,
    title: 'Quiche Lorraine',
    category: 'French',
    image: 'https://images.unsplash.com/photo-1611315764615-0e7dd3272f3e?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '60 min',
    servings: '6 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'French savory tart with bacon, cheese, and custard. Perfect for brunch or light dinner.',
    ingredients: ['1 pie crust', '200g bacon, chopped', '1.5 cups Gruyere cheese, grated', '4 eggs', '1.5 cups heavy cream', '1/4 tsp nutmeg', '1 onion, diced', 'Salt and pepper', 'Fresh chives'],
    steps: ['Blind bake pie crust at 375°F for 15 minutes.', 'Cook bacon until crispy, remove. Sauté onion in bacon fat.', 'Spread bacon, onion, cheese in crust.', 'Whisk eggs, cream, nutmeg, salt, pepper.', 'Pour custard mixture over bacon and cheese.', 'Bake at 350°F for 35-40 minutes until set.', 'Let cool 10 minutes before slicing.', 'Garnish with fresh chives.'],
    nutrition: { calories: 420, protein: '18g', carbs: '22g', fat: '30g' }
  },
  {
    id: 39,
    title: 'Chicken Shawarma',
    category: 'Middle Eastern',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '45 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 420,
    description: 'Marinated chicken with Middle Eastern spices in pita with tahini sauce. Street food perfection.',
    ingredients: ['600g chicken thighs', '1/4 cup yogurt', '3 cloves garlic', '2 tsp cumin', '2 tsp paprika', '1 tsp turmeric', '1/2 tsp cinnamon', '1/4 tsp cayenne', 'Lemon juice', '4 pita breads', 'Tahini sauce', 'Tomatoes', 'Lettuce', 'Pickles', 'Red onion', 'Olive oil'],
    steps: ['Mix yogurt, garlic, spices, lemon juice, olive oil.', 'Marinate chicken 2 hours or overnight.', 'Grill or pan-fry chicken until charred and cooked.', 'Let rest, then slice thinly.', 'Warm pita breads.', 'Spread tahini sauce on pita.', 'Fill with chicken, tomatoes, lettuce, pickles, onion.', 'Roll and serve with extra tahini.'],
    nutrition: { calories: 420, protein: '34g', carbs: '38g', fat: '16g' }
  },
  {
    id: 40,
    title: 'Risotto alla Milanese',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1476124369491-c4b47d123ab9?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '40 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 380,
    description: 'Creamy saffron risotto from Milan. Golden, luxurious, and perfectly al dente.',
    ingredients: ['2 cups arborio rice', '6 cups chicken stock, warm', '1 cup white wine', '1 onion, finely diced', '1/2 cup parmesan, grated', '4 tbsp butter', 'Saffron threads', '2 tbsp olive oil', 'Salt and pepper'],
    steps: ['Steep saffron in 1/4 cup warm stock.', 'Heat stock in separate pot, keep simmering.', 'Sauté onion in butter and oil until soft.', 'Add rice, toast 2 minutes stirring constantly.', 'Add wine, stir until absorbed.', 'Add stock one ladle at a time, stirring constantly.', 'After 15 minutes, add saffron. Continue adding stock.', 'When rice is creamy and al dente (20 min total), stir in butter and parmesan.'],
    nutrition: { calories: 380, protein: '12g', carbs: '58g', fat: '12g' }
  },
  {
    id: 41,
    title: 'Chicken Teriyaki',
    category: 'Japanese',
    image: 'https://images.unsplash.com/photo-1600249537761-e80e6a6d0a85?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '25 min',
    servings: '3 servings',
    difficulty: 'Easy',
    calories: 360,
    description: 'Glazed chicken with sweet and savory teriyaki sauce. Japanese home cooking favorite.',
    ingredients: ['500g chicken thighs', '1/4 cup soy sauce', '1/4 cup mirin', '2 tbsp sake', '2 tbsp sugar', '2 cloves garlic, minced', '1 tsp ginger, grated', '1 tbsp vegetable oil', 'Sesame seeds', 'Green onions, sliced', 'Steamed rice'],
    steps: ['Mix soy sauce, mirin, sake, sugar for teriyaki sauce.', 'Heat oil in pan, cook chicken skin-side down until golden.', 'Flip, cook other side.', 'Add garlic and ginger, cook 30 seconds.', 'Pour teriyaki sauce over chicken.', 'Simmer, basting chicken until sauce thickens and glazes.', 'Slice chicken, drizzle with sauce.', 'Garnish with sesame seeds and green onions. Serve with rice.'],
    nutrition: { calories: 360, protein: '32g', carbs: '28g', fat: '12g' }
  },
  {
    id: 42,
    title: 'Beef Tacos',
    category: 'Mexican',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '20 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 380,
    description: 'Classic ground beef tacos with fresh toppings. Quick, easy, and delicious.',
    ingredients: ['500g ground beef', '1 onion, diced', '2 cloves garlic', '2 tbsp taco seasoning', '1/2 cup water', '8 taco shells', 'Shredded lettuce', 'Diced tomatoes', 'Shredded cheese', 'Sour cream', 'Salsa', 'Cilantro', 'Lime wedges'],
    steps: ['Brown ground beef in skillet, drain fat.', 'Add onion and garlic, cook until soft.', 'Stir in taco seasoning and water.', 'Simmer 5 minutes until thickened.', 'Warm taco shells in oven.', 'Fill shells with beef mixture.', 'Top with lettuce, tomatoes, cheese, sour cream, salsa, cilantro.', 'Serve with lime wedges.'],
    nutrition: { calories: 380, protein: '26g', carbs: '32g', fat: '18g' }
  },
  {
    id: 43,
    title: 'Samosas',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '60 min',
    servings: '12 pieces',
    difficulty: 'Medium',
    calories: 180,
    description: 'Crispy triangular pastries filled with spiced potatoes and peas. Popular Indian snack.',
    ingredients: ['2 cups flour', '4 tbsp ghee', '3 potatoes, boiled and cubed', '1 cup peas', '1 onion, chopped', '2 tsp cumin seeds', '1 tsp garam masala', '1/2 tsp turmeric', '1 tsp coriander powder', '2 green chilies', '1 tsp ginger, grated', 'Oil for frying', 'Cilantro', 'Mint chutney', 'Tamarind chutney'],
    steps: ['Make dough: mix flour, ghee, salt. Add water, knead. Rest 30 minutes.', 'Heat oil, add cumin seeds. Add onion, ginger, chilies.', 'Add peas, potatoes, spices. Mix well. Cool.', 'Divide dough into balls, roll into ovals.', 'Cut in half, form cones, fill with potato mixture.', 'Seal edges with water.', 'Deep fry until golden brown.', 'Serve hot with chutneys.'],
    nutrition: { calories: 180, protein: '4g', carbs: '24g', fat: '8g' }
  },
  {
    id: 44,
    title: 'Coq au Vin',
    category: 'French',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '120 min',
    servings: '4 servings',
    difficulty: 'Hard',
    calories: 480,
    description: 'Chicken braised in red wine with mushrooms and pearl onions. Classic French comfort.',
    ingredients: ['1.5kg chicken, cut into pieces', '1 bottle red wine', '200g bacon, chopped', '200g pearl onions', '300g mushrooms', '2 carrots, sliced', '3 cloves garlic', '2 tbsp tomato paste', '2 cups chicken stock', '3 tbsp flour', '3 tbsp butter', 'Fresh thyme', 'Bay leaves', 'Parsley'],
    steps: ['Marinate chicken in wine overnight (optional).', 'Cook bacon until crispy, remove.', 'Brown chicken in bacon fat, remove.', 'Sauté onions, mushrooms, carrots. Remove.', 'Add flour to pan, cook 1 minute.', 'Add wine, stock, tomato paste, herbs. Bring to boil.', 'Return chicken and vegetables. Cover, simmer 45 minutes.', 'Finish with butter, garnish with parsley and bacon.'],
    nutrition: { calories: 480, protein: '42g', carbs: '18g', fat: '24g' }
  },
  {
    id: 45,
    title: 'General Tso\'s Chicken',
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '35 min',
    servings: '3 servings',
    difficulty: 'Medium',
    calories: 520,
    description: 'Sweet, spicy, and crispy Chinese-American chicken. Takeout favorite made at home.',
    ingredients: ['500g chicken thighs, cubed', '1/2 cup cornstarch', '2 eggs', '1/4 cup soy sauce', '3 tbsp rice vinegar', '3 tbsp sugar', '2 tbsp hoisin sauce', '1 tbsp sesame oil', '6 dried chilies', '4 cloves garlic', '1 tbsp ginger', 'Green onions', 'Sesame seeds', 'Oil for frying'],
    steps: ['Coat chicken in cornstarch and beaten eggs.', 'Deep fry until crispy and golden. Drain.', 'Mix soy sauce, vinegar, sugar, hoisin, sesame oil for sauce.', 'Heat small amount of oil, fry chilies, garlic, ginger.', 'Add sauce, bring to simmer.', 'Toss in fried chicken, coat with sauce.', 'Garnish with green onions and sesame seeds.', 'Serve over rice.'],
    nutrition: { calories: 520, protein: '34g', carbs: '52g', fat: '18g' }
  },
  {
    id: 46,
    title: 'Moussaka',
    category: 'Greek',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '120 min',
    servings: '8 servings',
    difficulty: 'Hard',
    calories: 460,
    description: 'Layered eggplant casserole with spiced meat and béchamel. Greek comfort food.',
    ingredients: ['3 large eggplants', '500g ground lamb', '2 onions, chopped', '3 cloves garlic', '1 can tomatoes', '1/4 cup red wine', '1 tsp cinnamon', '4 tbsp butter', '4 tbsp flour', '2 cups milk', '2 eggs', '1 cup parmesan', 'Olive oil', 'Nutmeg', 'Fresh parsley'],
    steps: ['Slice eggplant, salt, let sit 30 min. Rinse, brush with oil, bake until golden.', 'Cook lamb with onions and garlic. Add tomatoes, wine, cinnamon. Simmer 20 min.', 'Make béchamel: melt butter, add flour, gradually whisk in milk.', 'Remove from heat, whisk in eggs and half the cheese.', 'Layer: eggplant, meat sauce, repeat. Top with béchamel.', 'Sprinkle remaining cheese.', 'Bake at 350°F for 45 minutes until golden.', 'Cool 20 minutes before serving.'],
    nutrition: { calories: 460, protein: '26g', carbs: '28g', fat: '28g' }
  },
  {
    id: 47,
    title: 'Enchiladas',
    category: 'Mexican',
    image: 'https://images.unsplash.com/photo-1619221882210-08fe136f473d?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '45 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 480,
    description: 'Rolled tortillas filled with chicken and cheese, covered in enchilada sauce. Cheesy Mexican comfort.',
    ingredients: ['8 corn tortillas', '3 cups cooked chicken, shredded', '2 cups enchilada sauce', '2 cups Mexican cheese blend', '1 onion, diced', '1 can black beans', '1/4 cup sour cream', '1/4 cup cilantro', 'Jalapeños', 'Lime wedges'],
    steps: ['Mix chicken with half the cheese, onion, and beans.', 'Warm tortillas to make pliable.', 'Spread enchilada sauce in baking dish.', 'Fill each tortilla with chicken mixture, roll up.', 'Place seam-side down in dish.', 'Pour remaining sauce over enchiladas.', 'Top with remaining cheese.', 'Bake at 350°F for 20 minutes. Garnish with sour cream, cilantro, jalapeños.'],
    nutrition: { calories: 480, protein: '36g', carbs: '42g', fat: '20g' }
  },
  {
    id: 48,
    title: 'Fish and Chips',
    category: 'British',
    image: 'https://images.unsplash.com/photo-1579208570378-8c970854bc23?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '40 min',
    servings: '3 servings',
    difficulty: 'Medium',
    calories: 620,
    description: 'Beer-battered fish with crispy chips. British pub classic.',
    ingredients: ['600g white fish fillets', '4 large potatoes', '1 cup flour', '1 cup beer', '1 tsp baking powder', '2 eggs', 'Salt and pepper', 'Oil for frying', 'Malt vinegar', 'Tartar sauce', 'Mushy peas', 'Lemon wedges'],
    steps: ['Cut potatoes into thick chips, soak in cold water 30 minutes.', 'Make batter: whisk flour, baking powder, beer, eggs until smooth.', 'Dry chips thoroughly, fry at 325°F until soft. Drain.', 'Heat oil to 375°F. Coat fish in flour, then batter.', 'Fry fish until golden and crispy, 4-5 minutes.', 'Increase oil temp, fry chips again until crispy.', 'Season with salt.', 'Serve with vinegar, tartar sauce, mushy peas, lemon.'],
    nutrition: { calories: 620, protein: '38g', carbs: '68g', fat: '22g' }
  },
  {
    id: 49,
    title: 'Butter Chicken',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    rating: 4.9,
    time: '60 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 480,
    description: 'Creamy tomato curry with tender chicken. India\'s most beloved curry worldwide.',
    ingredients: ['600g chicken, cubed', '1 cup yogurt', '2 tbsp lemon juice', '2 tbsp ginger-garlic paste', '2 tsp tandoori masala', '4 tomatoes, pureed', '1 cup cream', '4 tbsp butter', '1 tsp garam masala', '1 tsp red chili powder', '1/2 tsp turmeric', '2 tbsp kasuri methi', 'Honey', 'Salt', 'Cilantro'],
    steps: ['Marinate chicken with yogurt, lemon juice, ginger-garlic, tandoori masala for 2 hours.', 'Grill or bake chicken until charred.', 'Melt butter, add tomato puree, chili powder, turmeric.', 'Cook until oil separates.', 'Add cream, garam masala, kasuri methi, honey.', 'Simmer 10 minutes.', 'Add grilled chicken, cook 5 more minutes.', 'Garnish with cream swirl and cilantro. Serve with naan.'],
    nutrition: { calories: 480, protein: '36g', carbs: '22g', fat: '28g' }
  },
  {
    id: 50,
    title: 'Osso Buco',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826117c?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '150 min',
    servings: '4 servings',
    difficulty: 'Hard',
    calories: 520,
    description: 'Braised veal shanks in white wine and vegetables. Milanese specialty with bone marrow.',
    ingredients: ['4 veal shanks', '1/2 cup flour', '2 carrots, diced', '2 celery stalks, diced', '1 onion, diced', '4 cloves garlic', '1 cup white wine', '2 cups beef stock', '1 can tomatoes', '2 bay leaves', 'Fresh thyme', 'Lemon zest', 'Parsley', 'Garlic', 'Olive oil', 'Salt and pepper'],
    steps: ['Tie veal shanks with kitchen twine. Season and coat in flour.', 'Brown shanks in olive oil on all sides. Remove.', 'Sauté carrots, celery, onion until soft.', 'Add garlic, cook 1 minute.', 'Deglaze with wine, reduce by half.', 'Add stock, tomatoes, bay leaves, thyme.', 'Return veal, bring to simmer. Cover, braise 2 hours at 325°F.', 'Make gremolata: mix lemon zest, parsley, garlic. Serve on top.'],
    nutrition: { calories: 520, protein: '48g', carbs: '24g', fat: '22g' }
  },
  {
    id: 51,
    title: 'Bao Buns',
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '120 min',
    servings: '8 buns',
    difficulty: 'Hard',
    calories: 280,
    description: 'Fluffy steamed buns filled with braised pork belly. Asian street food delight.',
    ingredients: ['2 cups flour', '1 tsp yeast', '2 tbsp sugar', '1/2 cup warm milk', '500g pork belly', '1/4 cup soy sauce', '2 tbsp rice wine', '2 tbsp hoisin sauce', '1 tbsp five-spice', 'Star anise', 'Ginger', 'Pickled vegetables', 'Cucumber', 'Cilantro', 'Hoisin sauce'],
    steps: ['Make dough: mix flour, yeast, sugar, milk. Knead, let rise 1 hour.', 'Braise pork: simmer with soy sauce, rice wine, five-spice, star anise, ginger for 2 hours.', 'Divide dough into 8 pieces, roll into ovals.', 'Brush with oil, fold in half. Let rise 30 minutes.', 'Steam buns for 10 minutes.', 'Slice braised pork.', 'Fill buns with pork, pickled vegetables, cucumber, cilantro.', 'Drizzle with hoisin sauce.'],
    nutrition: { calories: 280, protein: '14g', carbs: '32g', fat: '10g' }
  },
  {
    id: 52,
    title: 'Goulash',
    category: 'Hungarian',
    image: 'https://images.unsplash.com/photo-1610570659281-6c10e3900ec5?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '120 min',
    servings: '6 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Hungarian beef stew with paprika and vegetables. Hearty and warming.',
    ingredients: ['800g beef chuck, cubed', '3 onions, chopped', '3 tbsp paprika', '2 bell peppers, diced', '3 tomatoes, chopped', '2 potatoes, cubed', '2 carrots, sliced', '3 cloves garlic', '2 tbsp tomato paste', '1 tsp caraway seeds', 'Bay leaves', 'Beef stock', 'Sour cream', 'Fresh parsley'],
    steps: ['Brown beef in batches, set aside.', 'Sauté onions until soft and golden.', 'Add paprika, stir for 30 seconds (don\'t burn).', 'Add beef back, coat in paprika.', 'Add tomatoes, peppers, garlic, tomato paste, caraway, bay leaves.', 'Add stock to cover. Simmer 1.5 hours.', 'Add potatoes and carrots, cook 30 more minutes.', 'Serve with sour cream and parsley.'],
    nutrition: { calories: 420, protein: '36g', carbs: '32g', fat: '16g' }
  },
  {
    id: 53,
    title: 'Tempura',
    category: 'Japanese',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '30 min',
    servings: '3 servings',
    difficulty: 'Medium',
    calories: 320,
    description: 'Light, crispy battered vegetables and seafood. Japanese frying perfection.',
    ingredients: ['300g shrimp', 'Assorted vegetables (sweet potato, zucchini, eggplant, mushrooms)', '1 cup flour', '1 egg', '1 cup ice water', 'Oil for frying', 'Tentsuyu sauce (dashi, soy sauce, mirin)', 'Grated daikon', 'Ginger'],
    steps: ['Prep vegetables: slice sweet potato, zucchini into rounds; eggplant into sticks.', 'Devein shrimp, keep tails on.', 'Make batter: lightly mix flour, egg, ice water (keep lumpy).', 'Heat oil to 340-360°F.', 'Dip ingredients in batter lightly.', 'Fry in small batches until crispy.', 'Drain on paper towels.', 'Serve immediately with tentsuyu sauce, daikon, ginger.'],
    nutrition: { calories: 320, protein: '18g', carbs: '38g', fat: '10g' }
  },
  {
    id: 54,
    title: 'Poutine',
    category: 'Canadian',
    image: 'https://images.unsplash.com/photo-1630431341973-02e69b33f1c7?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '35 min',
    servings: '3 servings',
    difficulty: 'Medium',
    calories: 680,
    description: 'French fries topped with cheese curds and gravy. Canadian comfort food icon.',
    ingredients: ['4 large potatoes', '2 cups cheese curds', '2 cups beef gravy', '3 tbsp butter', '3 tbsp flour', '2 cups beef stock', 'Oil for frying', 'Salt and pepper', 'Fresh parsley'],
    steps: ['Cut potatoes into thick fries, soak in cold water.', 'Make gravy: melt butter, add flour, cook 2 minutes.', 'Gradually whisk in beef stock. Simmer until thick.', 'Dry fries thoroughly.', 'Fry at 325°F until soft, drain.', 'Increase temp to 375°F, fry again until crispy.', 'Top hot fries with cheese curds.', 'Pour hot gravy over everything. Garnish with parsley.'],
    nutrition: { calories: 680, protein: '22g', carbs: '72g', fat: '34g' }
  },
  {
    id: 55,
    title: 'Chicken Souvlaki',
    category: 'Greek',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '40 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 380,
    description: 'Grilled Greek chicken skewers with lemon and oregano. Simple and delicious.',
    ingredients: ['600g chicken breast, cubed', '1/4 cup olive oil', '3 tbsp lemon juice', '3 cloves garlic, minced', '1 tbsp oregano', '1 tsp paprika', '4 pita breads', 'Tzatziki sauce', 'Tomatoes, sliced', 'Red onion, sliced', 'Lettuce', 'Feta cheese', 'Bamboo skewers'],
    steps: ['Soak skewers in water 30 minutes.', 'Mix olive oil, lemon juice, garlic, oregano, paprika.', 'Marinate chicken 30 minutes minimum.', 'Thread chicken on skewers.', 'Grill 4-5 minutes per side until charred.', 'Warm pita breads.', 'Spread tzatziki on pita, add chicken.', 'Top with tomatoes, onion, lettuce, feta. Roll and serve.'],
    nutrition: { calories: 380, protein: '36g', carbs: '32g', fat: '12g' }
  },
  {
    id: 56,
    title: 'Pho Ga',
    category: 'Vietnamese',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '90 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 320,
    description: 'Vietnamese chicken noodle soup with aromatic broth. Lighter version of traditional pho.',
    ingredients: ['1 whole chicken', '300g rice noodles', '2 onions, halved', '4-inch ginger', '2 cinnamon sticks', '3 star anise', '1 tbsp coriander seeds', '3 tbsp fish sauce', 'Rock sugar', 'Bean sprouts', 'Fresh basil', 'Lime wedges', 'Jalapeños', 'Cilantro', 'Green onions'],
    steps: ['Char onions and ginger over flame.', 'Bring chicken and water to boil, skim foam.', 'Add charred onions, ginger, whole spices.', 'Simmer 45 minutes. Remove chicken, shred.', 'Strain broth, season with fish sauce and sugar.', 'Soak rice noodles until soft.', 'Blanch noodles in hot broth.', 'Assemble: noodles, chicken, hot broth, garnish with herbs, lime, chilies.'],
    nutrition: { calories: 320, protein: '28g', carbs: '42g', fat: '4g' }
  },
  {
    id: 57,
    title: 'Churros',
    category: 'Spanish',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '30 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 380,
    description: 'Fried dough pastry with cinnamon sugar. Spanish treat perfect with chocolate.',
    ingredients: ['1 cup water', '1/2 cup butter', '1 cup flour', '3 eggs', '1/4 tsp salt', '1 cup sugar', '1 tsp cinnamon', 'Oil for frying', 'Chocolate sauce for dipping'],
    steps: ['Bring water and butter to boil.', 'Add flour and salt all at once, stir vigorously.', 'Cook until dough forms ball and pulls from sides.', 'Let cool 5 minutes. Beat in eggs one at a time.', 'Heat oil to 375°F.', 'Pipe dough into oil in 6-inch strips.', 'Fry until golden brown, drain.', 'Roll in cinnamon sugar. Serve with chocolate sauce.'],
    nutrition: { calories: 380, protein: '6g', carbs: '48g', fat: '18g' }
  },
  {
    id: 58,
    title: 'Chicken Cacciatore',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '60 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Italian hunter-style chicken braised with tomatoes, peppers, and herbs.',
    ingredients: ['1.5kg chicken pieces', '2 bell peppers, sliced', '1 onion, sliced', '300g mushrooms, sliced', '4 cloves garlic', '1 can crushed tomatoes', '1/2 cup white wine', '1/2 cup chicken stock', 'Fresh basil', 'Fresh oregano', 'Bay leaves', 'Olive oil', 'Salt and pepper'],
    steps: ['Season chicken with salt and pepper.', 'Brown chicken in olive oil, remove.', 'Sauté onion, peppers, mushrooms until soft.', 'Add garlic, cook 1 minute.', 'Deglaze with wine, reduce by half.', 'Add tomatoes, stock, herbs, bay leaves.', 'Return chicken, simmer 30-40 minutes.', 'Garnish with fresh basil, serve with pasta or polenta.'],
    nutrition: { calories: 420, protein: '38g', carbs: '18g', fat: '22g' }
  },
  {
    id: 59,
    title: 'Dumplings',
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '60 min',
    servings: '24 dumplings',
    difficulty: 'Hard',
    calories: 35,
    description: 'Chinese dumplings with pork and vegetable filling. Steamed or pan-fried perfection.',
    ingredients: ['24 dumpling wrappers', '300g ground pork', '2 cups napa cabbage, finely chopped', '2 green onions, minced', '2 cloves garlic, minced', '1 tbsp ginger, grated', '2 tbsp soy sauce', '1 tbsp sesame oil', '1 tsp rice wine', 'Salt and pepper', 'Dipping sauce (soy, vinegar, chili oil)'],
    steps: ['Salt cabbage, let sit 10 minutes. Squeeze out water.', 'Mix pork, cabbage, green onions, garlic, ginger, soy sauce, sesame oil, rice wine.', 'Place 1 tbsp filling in center of wrapper.', 'Wet edges, fold and pleat to seal.', 'Steam for 8 minutes OR pan-fry until golden, add water, cover, steam.', 'Make dipping sauce.', 'Serve hot with sauce.'],
    nutrition: { calories: 35, protein: '3g', carbs: '3g', fat: '1g' }
  },
  {
    id: 60,
    title: 'Chicken Quesadilla',
    category: 'Mexican',
    image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '20 min',
    servings: '2 servings',
    difficulty: 'Easy',
    calories: 480,
    description: 'Grilled tortilla with chicken and melted cheese. Quick and satisfying.',
    ingredients: ['4 flour tortillas', '2 cups cooked chicken, shredded', '2 cups Mexican cheese blend', '1 bell pepper, sliced', '1 onion, sliced', '1 jalapeño, sliced', 'Cumin', 'Paprika', 'Sour cream', 'Guacamole', 'Salsa', 'Olive oil'],
    steps: ['Sauté peppers and onions until soft.', 'Season chicken with cumin and paprika.', 'Place tortilla in dry skillet.', 'Add cheese, chicken, peppers, onions, jalapeño on half.', 'Fold tortilla over.', 'Cook until golden and cheese melted, flip once.', 'Cut into triangles.', 'Serve with sour cream, guacamole, salsa.'],
    nutrition: { calories: 480, protein: '32g', carbs: '38g', fat: '22g' }
  },
  {
    id: 61,
    title: 'Bobotie',
    category: 'South African',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    rating: 4.5,
    time: '60 min',
    servings: '6 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Spiced minced meat baked with egg topping. South African comfort food with Cape Malay influences.',
    ingredients: ['600g ground beef', '2 onions, chopped', '2 cloves garlic', '2 tbsp curry powder', '1 tbsp turmeric', '1/4 cup chutney', '1/4 cup raisins', '1/4 cup almonds, chopped', '2 slices bread, soaked in milk', '3 eggs', '1 cup milk', '2 bay leaves', 'Lemon juice', 'Salt and pepper'],
    steps: ['Sauté onions and garlic until soft.', 'Add beef, brown well.', 'Add curry powder, turmeric, cook 2 minutes.', 'Add chutney, raisins, almonds, lemon juice, soaked bread.', 'Season, transfer to baking dish.', 'Whisk eggs and milk, pour over meat.', 'Top with bay leaves.', 'Bake at 350°F for 30-40 minutes until set.'],
    nutrition: { calories: 420, protein: '28g', carbs: '32g', fat: '20g' }
  },
  {
    id: 62,
    title: 'Tandoori Chicken',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '240 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 340,
    description: 'Yogurt-marinated chicken roasted with Indian spices. Vibrant and flavorful.',
    ingredients: ['1kg chicken legs', '1 cup yogurt', '2 tbsp lemon juice', '2 tbsp ginger-garlic paste', '2 tsp tandoori masala', '1 tsp cumin', '1 tsp coriander', '1/2 tsp turmeric', '1/2 tsp cayenne', 'Red food color (optional)', '2 tbsp oil', 'Salt', 'Lemon wedges', 'Onion rings'],
    steps: ['Score chicken deeply.', 'Mix all marinade ingredients.', 'Coat chicken completely, marinate 4 hours or overnight.', 'Preheat oven to 450°F or heat grill.', 'Place chicken on rack, brush with oil.', 'Roast/grill 25-30 minutes, turning once.', 'Char slightly for authentic flavor.', 'Serve with lemon wedges, onion rings, mint chutney.'],
    nutrition: { calories: 340, protein: '38g', carbs: '8g', fat: '16g' }
  },
  {
    id: 63,
    title: 'Tonkatsu',
    category: 'Japanese',
    image: 'https://images.unsplash.com/photo-1623206002962-2e12b098e50a?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '30 min',
    servings: '2 servings',
    difficulty: 'Medium',
    calories: 520,
    description: 'Breaded and fried pork cutlet. Crispy Japanese comfort food served with tangy sauce.',
    ingredients: ['2 pork loin chops', '1/2 cup flour', '2 eggs, beaten', '2 cups panko breadcrumbs', 'Oil for frying', 'Tonkatsu sauce', 'Shredded cabbage', 'Steamed rice', 'Lemon wedges', 'Salt and pepper'],
    steps: ['Pound pork to 1/2 inch thickness.', 'Season with salt and pepper.', 'Set up breading station: flour, eggs, panko.', 'Coat pork: flour, egg, panko. Press panko firmly.', 'Heat oil to 350°F.', 'Fry pork 4-5 minutes per side until golden.', 'Drain on paper towels, let rest 5 minutes.', 'Slice, serve with rice, cabbage, tonkatsu sauce, lemon.'],
    nutrition: { calories: 520, protein: '34g', carbs: '48g', fat: '22g' }
  },
  {
    id: 64,
    title: 'Pastrami Sandwich',
    category: 'American',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '15 min',
    servings: '2 servings',
    difficulty: 'Easy',
    calories: 520,
    description: 'New York deli classic with hot pastrami on rye with mustard. Simple perfection.',
    ingredients: ['400g pastrami, sliced', '4 slices rye bread', 'Spicy brown mustard', 'Swiss cheese (optional)', 'Pickles', 'Coleslaw (optional)'],
    steps: ['Heat pastrami in skillet or microwave.', 'Toast rye bread if desired.', 'Spread mustard on both slices.', 'Pile hot pastrami high on bread.', 'Add Swiss cheese if using.', 'Top with other bread slice.', 'Serve with pickles and coleslaw.'],
    nutrition: { calories: 520, protein: '38g', carbs: '42g', fat: '22g' }
  },
  {
    id: 65,
    title: 'Gnocchi',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '60 min',
    servings: '4 servings',
    difficulty: 'Hard',
    calories: 380,
    description: 'Soft Italian potato dumplings. Pillowy pasta perfection with your favorite sauce.',
    ingredients: ['1kg potatoes', '2 cups flour', '1 egg', '1 tsp salt', 'Butter', 'Fresh sage', 'Parmesan cheese', 'Nutmeg'],
    steps: ['Boil potatoes until tender. Peel while hot.', 'Rice potatoes or mash until smooth.', 'Add flour, egg, salt. Mix gently until dough forms.', 'Roll dough into ropes, cut into pieces.', 'Roll each piece down fork tines for ridges.', 'Bring salted water to boil.', 'Cook gnocchi until they float (2-3 minutes).', 'Toss with brown butter, sage, and parmesan.'],
    nutrition: { calories: 380, protein: '12g', carbs: '68g', fat: '8g' }
  },
  {
    id: 66,
    title: 'Khao Soi',
    category: 'Thai',
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '45 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 480,
    description: 'Northern Thai curry noodle soup with crispy noodles. Rich, creamy, and complex.',
    ingredients: ['400g egg noodles', '500g chicken thighs', '1 can coconut milk', '3 tbsp red curry paste', '2 tbsp yellow curry powder', '2 cups chicken stock', '2 tbsp fish sauce', '1 tbsp palm sugar', 'Lime wedges', 'Shallots, sliced and fried', 'Cilantro', 'Pickled mustard greens', 'Chili oil'],
    steps: ['Fry curry paste in coconut cream until fragrant.', 'Add curry powder, cook 1 minute.', 'Add chicken, coat in curry.', 'Add coconut milk and stock, simmer 20 minutes.', 'Cook noodles, divide among bowls. Reserve some for frying.', 'Deep fry reserved noodles until crispy.', 'Ladle curry over noodles.', 'Top with crispy noodles, fried shallots, cilantro, pickled greens. Serve with lime and chili oil.'],
    nutrition: { calories: 480, protein: '28g', carbs: '52g', fat: '18g' }
  },
  {
    id: 67,
    title: 'Jambalaya',
    category: 'American',
    image: 'https://images.unsplash.com/photo-1614964820938-c57ef3736888?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '50 min',
    servings: '6 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Louisiana rice dish with sausage, chicken, and Creole spices. One-pot Southern comfort.',
    ingredients: ['300g andouille sausage, sliced', '400g chicken thighs, cubed', '2 cups long-grain rice', '1 onion, diced', '1 bell pepper, diced', '2 celery stalks, diced', '4 cloves garlic', '1 can diced tomatoes', '3 cups chicken stock', '2 bay leaves', '2 tsp Cajun seasoning', '1 tsp thyme', 'Green onions', 'Hot sauce'],
    steps: ['Brown sausage, remove. Brown chicken, remove.', 'Sauté onion, bell pepper, celery (holy trinity) until soft.', 'Add garlic, Cajun seasoning, thyme. Cook 1 minute.', 'Add rice, toast 2 minutes.', 'Add tomatoes, stock, bay leaves. Bring to boil.', 'Return meats, cover, simmer 25 minutes.', 'Remove lid, fluff rice.', 'Garnish with green onions. Serve with hot sauce.'],
    nutrition: { calories: 420, protein: '26g', carbs: '52g', fat: '12g' }
  },
  {
    id: 68,
    title: 'Pierogi',
    category: 'Polish',
    image: 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '90 min',
    servings: '24 pieces',
    difficulty: 'Hard',
    calories: 85,
    description: 'Polish dumplings filled with potato and cheese. Boiled and pan-fried to perfection.',
    ingredients: ['3 cups flour', '1 egg', '1 cup sour cream', '4 potatoes, boiled and mashed', '1 cup cheddar cheese', '1 onion, diced', '4 tbsp butter', 'Salt and pepper', 'Additional sour cream for serving', 'Chives'],
    steps: ['Make dough: mix flour, egg, sour cream, salt. Knead until smooth.', 'Mix mashed potatoes with cheese and half the sautéed onions.', 'Roll dough thin, cut circles with glass.', 'Place filling in center, fold and seal edges.', 'Boil in salted water until they float (3-4 minutes).', 'Pan-fry boiled pierogi in butter until golden.', 'Sauté remaining onions in butter.', 'Top pierogi with onions, sour cream, and chives.'],
    nutrition: { calories: 85, protein: '3g', carbs: '12g', fat: '3g' }
  },
  {
    id: 69,
    title: 'Rendang',
    category: 'Indonesian',
    image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400&h=300&fit=crop',
    rating: 4.9,
    time: '180 min',
    servings: '6 servings',
    difficulty: 'Hard',
    calories: 480,
    description: 'Indonesian slow-cooked beef in coconut and spices. Complex, rich, and deeply flavorful.',
    ingredients: ['1kg beef chuck, cubed', '2 cans coconut milk', '4 shallots', '6 cloves garlic', '3 red chilies', '2-inch ginger', '2-inch galangal', '3 stalks lemongrass', '4 kaffir lime leaves', '1 cinnamon stick', '3 star anise', '2 tbsp tamarind paste', 'Palm sugar', 'Salt'],
    steps: ['Blend shallots, garlic, chilies, ginger, galangal to paste.', 'Cook paste in coconut milk until fragrant.', 'Add beef, lemongrass, lime leaves, whole spices.', 'Simmer uncovered 2.5-3 hours, stirring occasionally.', 'Add tamarind and sugar.', 'Continue cooking until liquid evaporates and beef is tender.', 'Sauce should be thick and coat beef.', 'Serve with rice.'],
    nutrition: { calories: 480, protein: '38g', carbs: '18g', fat: '30g' }
  },
  {
    id: 70,
    title: 'Eggs Benedict',
    category: 'American',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '30 min',
    servings: '2 servings',
    difficulty: 'Hard',
    calories: 520,
    description: 'Poached eggs on English muffin with ham and hollandaise. Classic brunch elegance.',
    ingredients: ['4 eggs', '2 English muffins', '4 slices Canadian bacon', '3 egg yolks', '1 tbsp lemon juice', '1/2 cup butter, melted', 'Cayenne pepper', 'White vinegar', 'Chives', 'Salt and pepper'],
    steps: ['Make hollandaise: blend egg yolks, lemon juice, cayenne.', 'Slowly add melted butter while blending. Keep warm.', 'Toast English muffins.', 'Pan-fry Canadian bacon.', 'Poach eggs: simmer water with vinegar, swirl water, add eggs. Cook 3 minutes.', 'Assemble: muffin, bacon, poached egg, hollandaise.', 'Garnish with chives and cayenne.', 'Serve immediately.'],
    nutrition: { calories: 520, protein: '24g', carbs: '28g', fat: '36g' }
  },
  {
    id: 71,
    title: 'Miso Ramen',
    category: 'Japanese',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '60 min',
    servings: '2 servings',
    difficulty: 'Medium',
    calories: 520,
    description: 'Ramen with rich miso-based broth. Hearty and soul-satisfying.',
    ingredients: ['400g fresh ramen noodles', '4 cups chicken/pork broth', '3 tbsp miso paste', '2 tbsp soy sauce', '1 tbsp sesame oil', '300g pork belly', '4 soft-boiled eggs', '2 green onions', 'Corn kernels', 'Bean sprouts', 'Nori sheets', 'Bamboo shoots', 'Garlic', 'Ginger'],
    steps: ['Roast pork belly, slice thinly.', 'Heat broth, whisk in miso paste until dissolved.', 'Add soy sauce, sesame oil, minced garlic, ginger.', 'Cook ramen noodles according to package.', 'Soft boil eggs (6.5 minutes), peel and halve.', 'Divide noodles into bowls.', 'Ladle hot miso broth over noodles.', 'Top with pork, egg, green onions, corn, bean sprouts, nori, bamboo.'],
    nutrition: { calories: 520, protein: '30g', carbs: '56g', fat: '20g' }
  },
  {
    id: 72,
    title: 'Chicken Schnitzel',
    category: 'German',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '25 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 420,
    description: 'Breaded and fried chicken cutlets. Crispy Austrian-German classic.',
    ingredients: ['4 chicken breasts', '1 cup flour', '3 eggs, beaten', '2 cups breadcrumbs', '1 lemon', 'Fresh parsley', 'Oil for frying', 'Salt and pepper', 'Potato salad or fries'],
    steps: ['Pound chicken to 1/4 inch thickness.', 'Season with salt and pepper.', 'Set up breading: flour, eggs, breadcrumbs.', 'Coat each cutlet: flour, egg, breadcrumbs.', 'Heat oil in large skillet.', 'Fry 3-4 minutes per side until golden.', 'Drain on paper towels.', 'Serve with lemon wedges, parsley, potato salad.'],
    nutrition: { calories: 420, protein: '38g', carbs: '36g', fat: '14g' }
  },
  {
    id: 73,
    title: 'Arepas',
    category: 'Venezuelan',
    image: 'https://images.unsplash.com/photo-1628191081548-fd3fd5f95618?w=400&h=300&fit=crop',
    rating: 4.5,
    time: '30 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 320,
    description: 'Corn cakes that can be grilled, baked, or fried, then stuffed. Venezuelan staple.',
    ingredients: ['2 cups pre-cooked cornmeal (masarepa)', '2.5 cups warm water', '1 tsp salt', 'Shredded chicken', 'Black beans', 'Avocado', 'Cheese', 'Plantains', 'Butter'],
    steps: ['Mix cornmeal, water, salt. Let rest 5 minutes.', 'Form into thick patties (1/2 inch).', 'Cook on griddle or skillet 5 minutes per side until golden.', 'Finish in oven at 350°F for 10 minutes.', 'Split open while hot.', 'Stuff with chicken, beans, avocado, cheese.', 'Add butter inside.', 'Serve hot with your favorite fillings.'],
    nutrition: { calories: 320, protein: '14g', carbs: '48g', fat: '10g' }
  },
  {
    id: 74,
    title: 'Laksa',
    category: 'Malaysian',
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '50 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 480,
    description: 'Spicy coconut curry noodle soup. Malaysian comfort with complex flavors.',
    ingredients: ['300g rice noodles', '400g shrimp', '2 cans coconut milk', '3 tbsp laksa paste', '2 cups chicken stock', '200g tofu puffs', 'Bean sprouts', '2 hard-boiled eggs', 'Fish sauce', 'Lime wedges', 'Fresh cilantro', 'Mint leaves', 'Sambal'],
    steps: ['Fry laksa paste in coconut cream until fragrant.', 'Add remaining coconut milk and stock.', 'Add fish sauce, bring to simmer.', 'Add shrimp and tofu puffs, cook until shrimp pink.', 'Cook rice noodles according to package.', 'Divide noodles into bowls.', 'Ladle hot soup over noodles.', 'Top with bean sprouts, halved eggs, herbs. Serve with lime and sambal.'],
    nutrition: { calories: 480, protein: '26g', carbs: '52g', fat: '20g' }
  },
  {
    id: 75,
    title: 'Chicken Piccata',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '25 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 360,
    description: 'Chicken in lemon-caper sauce. Bright, tangy Italian classic.',
    ingredients: ['4 chicken breasts, pounded thin', '1/2 cup flour', '4 tbsp butter', '1/2 cup white wine', '1/2 cup chicken stock', '3 tbsp lemon juice', '2 tbsp capers', 'Fresh parsley', 'Salt and pepper', 'Olive oil'],
    steps: ['Season chicken, dredge in flour.', 'Heat butter and oil, cook chicken until golden (3 minutes per side).', 'Remove chicken, keep warm.', 'Deglaze pan with wine, reduce by half.', 'Add stock and lemon juice, simmer 2 minutes.', 'Add capers and remaining butter.', 'Return chicken to sauce, coat well.', 'Garnish with parsley, serve with pasta.'],
    nutrition: { calories: 360, protein: '36g', carbs: '14g', fat: '18g' }
  },
  {
    id: 76,
    title: 'Kimchi Fried Rice',
    category: 'Korean',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '20 min',
    servings: '2 servings',
    difficulty: 'Easy',
    calories: 420,
    description: 'Fried rice with kimchi and gochujang. Quick Korean comfort food.',
    ingredients: ['3 cups cooked rice (day-old)', '1 cup kimchi, chopped', '2 eggs', '2 tbsp gochujang', '2 tbsp kimchi juice', '1 tbsp soy sauce', '2 tsp sesame oil', '2 green onions', 'Sesame seeds', 'Seaweed strips', 'Vegetable oil'],
    steps: ['Heat oil in wok or large pan.', 'Fry kimchi for 2 minutes.', 'Add rice, break up clumps.', 'Mix gochujang, kimchi juice, soy sauce. Add to rice.', 'Stir-fry until rice is heated and slightly crispy.', 'Push rice to side, fry eggs sunny-side up.', 'Top rice with fried egg.', 'Garnish with green onions, sesame seeds, seaweed. Drizzle sesame oil.'],
    nutrition: { calories: 420, protein: '14g', carbs: '62g', fat: '12g' }
  },
  {
    id: 77,
    title: 'Croque Monsieur',
    category: 'French',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '20 min',
    servings: '2 servings',
    difficulty: 'Easy',
    calories: 520,
    description: 'French grilled ham and cheese with béchamel. Elevated comfort sandwich.',
    ingredients: ['4 slices white bread', '4 slices ham', '2 cups Gruyere cheese, grated', '2 tbsp butter', '2 tbsp flour', '1 cup milk', 'Dijon mustard', 'Nutmeg', 'Salt and pepper'],
    steps: ['Make béchamel: melt butter, add flour, gradually whisk in milk. Add nutmeg.', 'Spread mustard on bread slices.', 'Layer: bread, cheese, ham, cheese, bread.', 'Brush outside with butter.', 'Grill in pan until golden on both sides.', 'Top with béchamel sauce and more cheese.', 'Broil until bubbly and golden.', 'Serve hot.'],
    nutrition: { calories: 520, protein: '32g', carbs: '38g', fat: '28g' }
  },
  {
    id: 78,
    title: 'Empanadas',
    category: 'Latin American',
    image: 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '60 min',
    servings: '12 pieces',
    difficulty: 'Medium',
    calories: 220,
    description: 'Savory pastry pockets filled with meat and vegetables. Latin American favorite.',
    ingredients: ['3 cups flour', '1/2 cup butter', '1 egg', '300g ground beef', '1 onion, diced', '1 bell pepper, diced', '2 hard-boiled eggs, chopped', '1/4 cup raisins', '1/4 cup green olives', '1 tsp cumin', '1 tsp paprika', 'Egg wash', 'Salt and pepper'],
    steps: ['Make dough: mix flour, butter, egg, water. Rest 30 minutes.', 'Cook beef with onion, pepper, spices. Add eggs, raisins, olives. Cool.', 'Roll dough thin, cut circles (5-inch).', 'Place filling on half of circle.', 'Fold over, crimp edges with fork.', 'Brush with egg wash.', 'Bake at 375°F for 25 minutes until golden.', 'Serve with chimichurri or salsa.'],
    nutrition: { calories: 220, protein: '10g', carbs: '24g', fat: '10g' }
  },
  {
    id: 79,
    title: 'Chicken Adobo',
    category: 'Filipino',
    image: 'https://images.unsplash.com/photo-1605493939429-1e56bd6e32ce?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '50 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 380,
    description: 'Filipino chicken braised in vinegar, soy sauce, and garlic. Tangy, savory national dish.',
    ingredients: ['1kg chicken pieces', '1/2 cup soy sauce', '1/2 cup white vinegar', '6 cloves garlic, crushed', '1 onion, sliced', '2 bay leaves', '1 tsp black peppercorns', '2 tbsp brown sugar', '1 cup water', 'Steamed rice', 'Green onions'],
    steps: ['Marinate chicken in soy sauce, vinegar, garlic for 30 minutes.', 'Transfer everything to pot, add onion, bay leaves, peppercorns, water.', 'Bring to boil, then simmer uncovered 30 minutes.', 'Remove chicken, reduce sauce until thickened.', 'Add sugar, adjust seasoning.', 'Return chicken, coat with sauce.', 'Simmer 5 more minutes.', 'Serve over rice, garnish with green onions.'],
    nutrition: { calories: 380, protein: '36g', carbs: '18g', fat: '18g' }
  },
  {
    id: 80,
    title: 'Borscht',
    category: 'Ukrainian',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
    rating: 4.5,
    time: '90 min',
    servings: '6 servings',
    difficulty: 'Medium',
    calories: 280,
    description: 'Beetroot soup with vegetables and beef. Vibrant Eastern European comfort.',
    ingredients: ['500g beef chuck', '4 beets, grated', '3 potatoes, cubed', '2 carrots, sliced', '1 onion, diced', '1/2 cabbage, shredded', '3 tbsp tomato paste', '3 cloves garlic', '2 bay leaves', '6 cups beef stock', 'Sour cream', 'Fresh dill', 'White vinegar', 'Salt and pepper'],
    steps: ['Simmer beef in stock with bay leaves for 1 hour. Remove beef, shred.', 'Sauté onion and carrots.', 'Add beets and tomato paste, cook 5 minutes.', 'Add to stock with potatoes and cabbage.', 'Simmer 30 minutes until vegetables tender.', 'Return beef, add vinegar, season.', 'Add minced garlic, simmer 5 minutes.', 'Serve with dollop of sour cream and fresh dill.'],
    nutrition: { calories: 280, protein: '22g', carbs: '32g', fat: '8g' }
  },
  {
    id: 81,
    title: 'Chicken Katsu Curry',
    category: 'Japanese',
    image: 'https://images.unsplash.com/photo-1623206002962-2e12b098e50a?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '45 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 620,
    description: 'Breaded chicken cutlet with Japanese curry sauce. Comfort food fusion.',
    ingredients: ['4 chicken breasts', '1 cup flour', '2 eggs', '2 cups panko', 'Oil for frying', '2 onions, sliced', '2 carrots, diced', '2 potatoes, cubed', '4 cups chicken stock', '1 package Japanese curry roux', 'Steamed rice', 'Fukujinzuke pickle'],
    steps: ['Pound chicken, bread with flour, egg, panko. Fry until golden.', 'Sauté onions until soft.', 'Add carrots and potatoes, cook 5 minutes.', 'Add stock, simmer 20 minutes until vegetables tender.', 'Turn off heat, add curry roux, stir until dissolved.', 'Simmer 5 more minutes until thick.', 'Slice chicken katsu.', 'Serve rice with curry and sliced katsu. Add pickle on side.'],
    nutrition: { calories: 620, protein: '38g', carbs: '72g', fat: '20g' }
  },
  {
    id: 82,
    title: 'Chicken Souvlaki Bowl',
    category: 'Greek',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '35 min',
    servings: '3 servings',
    difficulty: 'Easy',
    calories: 480,
    description: 'Greek chicken bowl with rice, vegetables, and tzatziki. Healthy and flavorful.',
    ingredients: ['500g chicken breast, cubed', '2 cups cooked rice', '1/4 cup olive oil', '3 tbsp lemon juice', '2 tsp oregano', '3 cloves garlic', 'Cherry tomatoes', 'Cucumber, diced', 'Red onion, sliced', 'Kalamata olives', 'Feta cheese', 'Tzatziki sauce', 'Fresh parsley'],
    steps: ['Marinate chicken in olive oil, lemon juice, oregano, garlic for 30 minutes.', 'Grill or pan-fry chicken until cooked through.', 'Prepare rice bowls with base of rice.', 'Top with grilled chicken.', 'Add tomatoes, cucumber, onion, olives.', 'Crumble feta cheese on top.', 'Drizzle with tzatziki sauce.', 'Garnish with parsley and serve.'],
    nutrition: { calories: 480, protein: '36g', carbs: '48g', fat: '16g' }
  },
  {
    id: 83,
    title: 'Beef Stroganoff',
    category: 'Russian',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '35 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 480,
    description: 'Beef in creamy mushroom sauce. Russian comfort classic.',
    ingredients: ['600g beef sirloin, sliced thin', '300g mushrooms, sliced', '1 onion, diced', '3 cloves garlic', '2 tbsp flour', '1 cup beef stock', '1 cup sour cream', '2 tbsp Dijon mustard', '3 tbsp butter', 'Egg noodles', 'Fresh parsley', 'Salt and pepper'],
    steps: ['Season beef with salt and pepper.', 'Sear beef in batches in hot butter, remove.', 'Sauté onion and mushrooms until golden.', 'Add garlic, cook 1 minute.', 'Sprinkle flour, cook 1 minute.', 'Add stock, scrape up brown bits, simmer until thick.', 'Stir in sour cream and mustard.', 'Return beef, heat through. Serve over egg noodles with parsley.'],
    nutrition: { calories: 480, protein: '36g', carbs: '32g', fat: '24g' }
  },
  {
    id: 84,
    title: 'Chicken Vindaloo',
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '60 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 380,
    description: 'Spicy Goan curry with vinegar and garlic. Fiery Indo-Portuguese fusion.',
    ingredients: ['600g chicken, cubed', '4 dried red chilies', '1 tbsp cumin seeds', '1 tsp mustard seeds', '8 cloves garlic', '2-inch ginger', '1/4 cup vinegar', '1 tbsp paprika', '1 tsp turmeric', '2 onions, chopped', '2 tomatoes, chopped', '3 tbsp oil', 'Curry leaves', 'Salt', 'Cilantro'],
    steps: ['Toast chilies, cumin, mustard seeds.', 'Blend with garlic, ginger, vinegar to paste.', 'Marinate chicken in paste for 30 minutes.', 'Heat oil, add curry leaves, sauté onions.', 'Add marinated chicken, cook 5 minutes.', 'Add tomatoes, paprika, turmeric.', 'Add water, simmer 30 minutes until chicken tender.', 'Garnish with cilantro, serve with rice.'],
    nutrition: { calories: 380, protein: '36g', carbs: '18g', fat: '18g' }
  },
  {
    id: 85,
    title: 'Poke Bowl',
    category: 'Hawaiian',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    rating: 4.8,
    time: '20 min',
    servings: '2 servings',
    difficulty: 'Easy',
    calories: 420,
    description: 'Hawaiian raw fish bowl with rice and vegetables. Fresh and healthy.',
    ingredients: ['300g sushi-grade tuna', '2 cups cooked sushi rice', '3 tbsp soy sauce', '1 tbsp sesame oil', '1 tsp rice vinegar', '1 avocado, sliced', '1 cucumber, diced', 'Edamame', 'Seaweed salad', 'Sesame seeds', 'Green onions', 'Sriracha mayo'],
    steps: ['Dice tuna into cubes.', 'Mix soy sauce, sesame oil, rice vinegar.', 'Toss tuna in sauce, marinate 10 minutes.', 'Divide rice between bowls.', 'Arrange tuna, avocado, cucumber, edamame, seaweed on rice.', 'Drizzle with sriracha mayo.', 'Sprinkle sesame seeds and green onions.', 'Serve immediately.'],
    nutrition: { calories: 420, protein: '32g', carbs: '48g', fat: '12g' }
  },
  {
    id: 86,
    title: 'Chicken Marsala',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '30 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 380,
    description: 'Chicken in Marsala wine sauce with mushrooms. Italian-American restaurant classic.',
    ingredients: ['4 chicken breasts, pounded thin', '300g mushrooms, sliced', '3/4 cup Marsala wine', '1/2 cup chicken stock', '1/2 cup flour', '4 tbsp butter', '2 tbsp olive oil', '3 cloves garlic', 'Fresh parsley', 'Salt and pepper'],
    steps: ['Dredge chicken in seasoned flour.', 'Pan-fry in butter and oil until golden, remove.', 'Sauté mushrooms and garlic until golden.', 'Deglaze with Marsala, reduce by half.', 'Add stock, simmer 3 minutes.', 'Return chicken, simmer until cooked through.', 'Finish with butter for glossy sauce.', 'Garnish with parsley, serve with pasta or mashed potatoes.'],
    nutrition: { calories: 380, protein: '36g', carbs: '18g', fat: '16g' }
  },
  {
    id: 87,
    title: 'Banh Xeo',
    category: 'Vietnamese',
    image: 'https://images.unsplash.com/photo-1591814483164-e3d9e1d89809?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '40 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 320,
    description: 'Vietnamese savory crepes with shrimp and bean sprouts. Crispy and fresh.',
    ingredients: ['1 cup rice flour', '1/2 cup coconut milk', '1 cup water', '1/2 tsp turmeric', '300g shrimp', '200g pork belly, sliced', 'Bean sprouts', 'Green onions', 'Lettuce leaves', 'Fresh herbs (mint, cilantro, basil)', 'Nuoc cham sauce', 'Vegetable oil'],
    steps: ['Make batter: mix rice flour, coconut milk, water, turmeric. Rest 30 minutes.', 'Cook pork until crispy. Cook shrimp.', 'Heat oil in non-stick pan, pour thin layer of batter.', 'Add pork, shrimp, bean sprouts, green onions on half.', 'Cover, cook until crispy.', 'Fold in half like omelet.', 'Wrap in lettuce with herbs.', 'Dip in nuoc cham sauce.'],
    nutrition: { calories: 320, protein: '22g', carbs: '32g', fat: '12g' }
  },
  {
    id: 88,
    title: 'Chicken Tinga',
    category: 'Mexican',
    image: 'https://images.unsplash.com/photo-1599974982056-def8f6f0e1f1?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '40 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 320,
    description: 'Shredded chicken in smoky chipotle tomato sauce. Versatile Mexican filling.',
    ingredients: ['600g chicken breasts', '1 can diced tomatoes', '3 chipotle peppers in adobo', '1 onion, sliced', '3 cloves garlic', '1 tsp oregano', '1/2 tsp cumin', 'Chicken stock', 'Tostadas or tortillas', 'Avocado', 'Sour cream', 'Queso fresco', 'Cilantro'],
    steps: ['Poach chicken in stock until cooked. Shred.', 'Blend tomatoes, chipotles, garlic.', 'Sauté onion until soft.', 'Add tomato-chipotle sauce, oregano, cumin.', 'Simmer 10 minutes.', 'Add shredded chicken, cook 5 minutes.', 'Adjust seasoning.', 'Serve on tostadas or in tacos with avocado, sour cream, cheese, cilantro.'],
    nutrition: { calories: 320, protein: '36g', carbs: '18g', fat: '12g' }
  },
  {
    id: 89,
    title: 'Tabbouleh',
    category: 'Middle Eastern',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=300&fit=crop',
    rating: 4.5,
    time: '30 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 180,
    description: 'Fresh parsley salad with bulgur, tomatoes, and lemon. Bright Lebanese classic.',
    ingredients: ['1/2 cup bulgur wheat', '2 cups fresh parsley, chopped', '1/2 cup mint, chopped', '3 tomatoes, diced', '1/2 cucumber, diced', '3 green onions, sliced', '1/4 cup lemon juice', '1/4 cup olive oil', 'Salt and pepper'],
    steps: ['Soak bulgur in hot water 20 minutes. Drain and squeeze dry.', 'Chop parsley and mint finely.', 'Mix bulgur, parsley, mint, tomatoes, cucumber, green onions.', 'Whisk lemon juice, olive oil, salt, pepper.', 'Pour dressing over salad, toss well.', 'Refrigerate 30 minutes for flavors to meld.', 'Adjust seasoning before serving.', 'Serve with pita bread.'],
    nutrition: { calories: 180, protein: '4g', carbs: '22g', fat: '10g' }
  },
  {
    id: 90,
    title: 'Orange Chicken',
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '35 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 520,
    description: 'Sweet and tangy crispy chicken. American-Chinese takeout favorite.',
    ingredients: ['600g chicken breast, cubed', '1/2 cup cornstarch', '2 eggs', '1/2 cup orange juice', 'Zest of 1 orange', '3 tbsp soy sauce', '3 tbsp sugar', '2 tbsp rice vinegar', '1 tbsp ginger, minced', '3 cloves garlic', '1 tsp red pepper flakes', 'Oil for frying', 'Green onions', 'Sesame seeds'],
    steps: ['Coat chicken in cornstarch and beaten eggs.', 'Deep fry until crispy and golden. Drain.', 'Make sauce: combine orange juice, zest, soy sauce, sugar, vinegar.', 'Sauté ginger, garlic, red pepper flakes.', 'Add orange sauce, simmer until thick.', 'Toss fried chicken in sauce.', 'Garnish with green onions and sesame seeds.', 'Serve over rice.'],
    nutrition: { calories: 520, protein: '36g', carbs: '58g', fat: '16g' }
  },
  {
    id: 91,
    title: 'Croque Madame',
    category: 'French',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '25 min',
    servings: '2 servings',
    difficulty: 'Medium',
    calories: 580,
    description: 'Croque Monsieur topped with fried egg. French brunch decadence.',
    ingredients: ['4 slices white bread', '4 slices ham', '2 cups Gruyere, grated', '2 tbsp butter', '2 tbsp flour', '1 cup milk', '2 eggs', 'Dijon mustard', 'Nutmeg', 'Salt and pepper'],
    steps: ['Make béchamel: melt butter, add flour, whisk in milk. Season with nutmeg.', 'Spread mustard on bread.', 'Layer: bread, cheese, ham, cheese, bread.', 'Top with béchamel and more cheese.', 'Bake at 400°F until bubbly and golden.', 'Fry eggs sunny-side up.', 'Top each sandwich with fried egg.', 'Serve immediately.'],
    nutrition: { calories: 580, protein: '36g', carbs: '40g', fat: '32g' }
  },
  {
    id: 92,
    title: 'Chicken Satay with Peanut Sauce',
    category: 'Thai',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '45 min',
    servings: '4 servings',
    difficulty: 'Easy',
    calories: 380,
    description: 'Grilled chicken skewers with creamy peanut sauce. Thai street food favorite.',
    ingredients: ['600g chicken thighs, cubed', '2 tbsp curry powder', '1 tbsp turmeric', '2 tbsp fish sauce', '2 tbsp brown sugar', '1 can coconut milk', '1/2 cup peanut butter', '2 tbsp lime juice', '1 tbsp soy sauce', '1 tbsp sriracha', 'Bamboo skewers', 'Cucumber salad'],
    steps: ['Soak skewers in water.', 'Marinate chicken in curry powder, turmeric, fish sauce, sugar, half coconut milk for 30 minutes.', 'Thread chicken on skewers.', 'Make peanut sauce: simmer remaining coconut milk, peanut butter, lime juice, soy sauce, sriracha.', 'Grill skewers 3-4 minutes per side.', 'Thin peanut sauce with water if needed.', 'Serve skewers with peanut sauce and cucumber salad.'],
    nutrition: { calories: 380, protein: '34g', carbs: '16g', fat: '22g' }
  },
  {
    id: 93,
    title: 'Chicken Katsu Sandwich',
    category: 'Japanese',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '30 min',
    servings: '2 servings',
    difficulty: 'Easy',
    calories: 580,
    description: 'Crispy chicken cutlet sandwich with tonkatsu sauce. Japanese comfort sandwich.',
    ingredients: ['2 chicken breasts', '1/2 cup flour', '2 eggs', '2 cups panko', 'Oil for frying', '4 slices white bread', 'Tonkatsu sauce', 'Japanese mayo', 'Shredded cabbage', 'Tomato slices'],
    steps: ['Pound chicken thin.', 'Bread with flour, egg, panko.', 'Deep fry until golden and cooked through.', 'Toast bread lightly.', 'Spread mayo and tonkatsu sauce on bread.', 'Layer cabbage, tomato, chicken katsu.', 'Top with more sauce.', 'Cut diagonally and serve.'],
    nutrition: { calories: 580, protein: '38g', carbs: '52g', fat: '24g' }
  },
  {
    id: 94,
    title: 'Pasta Puttanesca',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '25 min',
    servings: '3 servings',
    difficulty: 'Easy',
    calories: 420,
    description: 'Spaghetti with tomatoes, olives, capers, and anchovies. Bold Italian flavors.',
    ingredients: ['300g spaghetti', '1 can crushed tomatoes', '1/2 cup Kalamata olives', '3 tbsp capers', '4 anchovy fillets', '4 cloves garlic, minced', '1/2 tsp red pepper flakes', '3 tbsp olive oil', 'Fresh parsley', 'Parmesan (optional)', 'Salt and pepper'],
    steps: ['Cook pasta until al dente.', 'Heat olive oil, sauté garlic and anchovies until anchovies dissolve.', 'Add red pepper flakes.', 'Add tomatoes, simmer 10 minutes.', 'Add olives and capers, simmer 5 minutes.', 'Toss drained pasta with sauce.', 'Garnish with parsley.', 'Serve with or without parmesan (traditionally without).'],
    nutrition: { calories: 420, protein: '14g', carbs: '62g', fat: '14g' }
  },
  {
    id: 95,
    title: 'Beef Rendang',
    category: 'Indonesian',
    image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400&h=300&fit=crop',
    rating: 4.9,
    time: '180 min',
    servings: '6 servings',
    difficulty: 'Hard',
    calories: 480,
    description: 'Slow-cooked Indonesian beef curry. Rich, complex, deeply flavorful.',
    ingredients: ['1kg beef chuck', '2 cans coconut milk', '5 shallots', '6 garlic cloves', '3 red chilies', '2-inch ginger', '2-inch galangal', '3 lemongrass stalks', '5 kaffir lime leaves', '2 tbsp tamarind paste', 'Palm sugar', '1 cinnamon stick', '3 star anise', 'Toasted coconut', 'Salt'],
    steps: ['Blend shallots, garlic, chilies, ginger, galangal to paste.', 'Cook paste in coconut milk until fragrant and oil separates.', 'Add beef, coat in paste.', 'Add lemongrass, lime leaves, cinnamon, star anise.', 'Simmer uncovered 2.5-3 hours, stirring occasionally.', 'Add tamarind and palm sugar.', 'Continue cooking until liquid evaporates completely.', 'Beef should be tender and dark. Serve with rice.'],
    nutrition: { calories: 480, protein: '38g', carbs: '18g', fat: '30g' }
  },
  {
    id: 96,
    title: 'Chicken Enchiladas Verdes',
    category: 'Mexican',
    image: 'https://images.unsplash.com/photo-1621889976646-b64d4ee56ec8?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '50 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 460,
    description: 'Chicken enchiladas with tangy green tomatillo sauce. Fresh Mexican comfort.',
    ingredients: ['8 corn tortillas', '3 cups cooked chicken, shredded', '500g tomatillos', '2 jalapeños', '1/2 onion', '3 cloves garlic', '1/2 cup cilantro', '1 cup Mexican crema', '2 cups Monterey Jack cheese', 'Chicken stock', 'Cumin', 'Salt'],
    steps: ['Roast tomatillos, jalapeños, onion, garlic until charred.', 'Blend with cilantro, cumin, salt. Add stock to thin.', 'Simmer sauce 10 minutes.', 'Mix chicken with half the cheese.', 'Dip tortillas in sauce to soften.', 'Fill with chicken, roll, place in baking dish.', 'Pour remaining sauce over enchiladas.', 'Top with cheese, bake at 350°F for 20 minutes. Drizzle with crema.'],
    nutrition: { calories: 460, protein: '38g', carbs: '36g', fat: '20g' }
  },
  {
    id: 97,
    title: 'Chicken Paprikash',
    category: 'Hungarian',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
    rating: 4.6,
    time: '50 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Hungarian chicken stew with paprika and sour cream. Comforting and flavorful.',
    ingredients: ['1.5kg chicken pieces', '2 onions, chopped', '3 tbsp sweet paprika', '1 tsp hot paprika', '2 bell peppers, sliced', '3 tomatoes, chopped', '1 cup chicken stock', '1 cup sour cream', '3 tbsp flour', '3 tbsp butter', 'Egg noodles', 'Fresh parsley'],
    steps: ['Season chicken with salt and pepper.', 'Sauté onions in butter until soft.', 'Add both paprikas, cook 30 seconds.', 'Add chicken, brown on all sides.', 'Add peppers, tomatoes, stock.', 'Cover, simmer 30 minutes until chicken tender.', 'Mix sour cream with flour, stir into sauce.', 'Simmer 5 minutes. Serve over egg noodles with parsley.'],
    nutrition: { calories: 420, protein: '36g', carbs: '28g', fat: '20g' }
  },
  {
    id: 98,
    title: 'Kimchi Jjigae',
    category: 'Korean',
    image: 'https://images.unsplash.com/photo-1600788907416-456578634209?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '35 min',
    servings: '3 servings',
    difficulty: 'Easy',
    calories: 320,
    description: 'Korean kimchi stew with pork and tofu. Spicy, tangy comfort in a bowl.',
    ingredients: ['2 cups kimchi, chopped', '200g pork belly, sliced', '1 block tofu, cubed', '1 onion, sliced', '2 green onions', '3 cloves garlic', '1 tbsp gochugaru', '1 tbsp gochujang', '1 tbsp soy sauce', '1 tsp sugar', '3 cups stock', 'Sesame oil', 'Steamed rice'],
    steps: ['Cook pork belly until crispy.', 'Add garlic, kimchi, gochugaru. Stir-fry 5 minutes.', 'Add stock, gochujang, soy sauce, sugar.', 'Bring to boil, simmer 15 minutes.', 'Add tofu and onion, simmer 5 minutes.', 'Add green onions.', 'Drizzle with sesame oil.', 'Serve bubbling hot with rice.'],
    nutrition: { calories: 320, protein: '18g', carbs: '22g', fat: '18g' }
  },
  {
    id: 99,
    title: 'Chicken Cacciatore',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '60 min',
    servings: '4 servings',
    difficulty: 'Medium',
    calories: 420,
    description: 'Hunter-style chicken with tomatoes, peppers, and mushrooms. Rustic Italian comfort.',
    ingredients: ['1.5kg chicken pieces', '2 bell peppers, sliced', '1 onion, sliced', '300g mushrooms', '4 cloves garlic', '1 can crushed tomatoes', '1/2 cup white wine', '1/2 cup chicken stock', 'Fresh basil', 'Fresh oregano', '2 bay leaves', 'Olive oil', 'Salt and pepper'],
    steps: ['Season and brown chicken in olive oil. Remove.', 'Sauté onion, peppers, mushrooms until soft.', 'Add garlic, cook 1 minute.', 'Deglaze with wine, reduce by half.', 'Add tomatoes, stock, herbs, bay leaves.', 'Return chicken, bring to simmer.', 'Cover, cook 40 minutes until chicken tender.', 'Garnish with fresh basil. Serve with polenta or pasta.'],
    nutrition: { calories: 420, protein: '38g', carbs: '18g', fat: '22g' }
  },
  {
    id: 100,
    title: 'Drunken Noodles (Pad Kee Mao)',
    category: 'Thai',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop',
    rating: 4.7,
    time: '25 min',
    servings: '2 servings',
    difficulty: 'Medium',
    calories: 460,
    description: 'Spicy Thai stir-fried noodles with basil. Bold flavors and fiery heat.',
    ingredients: ['300g wide rice noodles', '200g chicken or shrimp', '2 eggs', '3 Thai chilies, chopped', '4 cloves garlic, minced', '1 bell pepper, sliced', '1 onion, sliced', '2 cups Thai basil', '2 tbsp dark soy sauce', '1 tbsp light soy sauce', '1 tbsp fish sauce', '1 tbsp sugar', '3 tbsp vegetable oil'],
    steps: ['Soak rice noodles until soft.', 'Heat wok on highest heat, add oil.', 'Stir-fry garlic and chilies until fragrant.', 'Add protein, cook through. Push aside.', 'Scramble eggs.', 'Add noodles, both soy sauces, fish sauce, sugar.', 'Add bell pepper and onion, toss vigorously.', 'Add Thai basil, toss until wilted. Serve immediately.'],
    nutrition: { calories: 460, protein: '24g', carbs: '62g', fat: '14g' }
  }
],

        getAll() { return this.recipes; },

        getById(id) { return this.recipes.find(r => r.id === parseInt(id)); },

        getByCategory(category) {
            if (!category || category === 'all') return this.recipes;
            return this.recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
        },

        search(query) {
            const q = query.toLowerCase().trim();
            if (!q) return this.recipes;

            // Handle alternate spellings
            const alternates = {
                'dosai': 'dosa', 'thosai': 'dosa', 'thosei': 'dosa',
                'idly': 'idli', 'iddly': 'idli', 'iddli': 'idli',
                'biriyani': 'biryani', 'briyani': 'biryani', 'biriani': 'biryani',
                'sambhar': 'sambar', 'sambhaar': 'sambar',
                'kothu': 'kothu parotta', 'parrotta': 'parotta',
                'vadai': 'vada', 'medhu': 'medu vada',
                'payasam': 'payasam', 'kheer': 'payasam',
                'kaapi': 'filter coffee', 'degree coffee': 'filter coffee',
                'chettinaad': 'chettinad',
                'uttappam': 'uttapam', 'uthappam': 'uttapam'
            };

            const searchTerm = alternates[q] || q;

            return this.recipes.filter(r =>
                r.title.toLowerCase().includes(searchTerm) ||
                r.category.toLowerCase().includes(searchTerm) ||
                r.description.toLowerCase().includes(searchTerm) ||
                r.ingredients.some(i => i.toLowerCase().includes(searchTerm))
            );
        }
    };

    // ==========================================
    // THEMEALDB API — Free Recipe Database
    // ==========================================
    const MealAPI = {
        BASE: 'https://www.themealdb.com/api/json/v1/1',

        async searchByName(query) {
            try {
                const res = await fetch(this.BASE + '/search.php?s=' + encodeURIComponent(query));
                const data = await res.json();
                return data.meals || [];
            } catch (e) { console.warn('API error:', e); return []; }
        },

        async getById(id) {
            try {
                const res = await fetch(this.BASE + '/lookup.php?i=' + id);
                const data = await res.json();
                return data.meals ? data.meals[0] : null;
            } catch (e) { return null; }
        },

        formatMeal(meal) {
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ing = meal['strIngredient' + i];
                const measure = meal['strMeasure' + i];
                if (ing && ing.trim()) {
                    ingredients.push((measure ? measure.trim() + ' ' : '') + ing.trim());
                }
            }
            const steps = meal.strInstructions
                ? meal.strInstructions.split(/\r?\n/).filter(s => s.trim().length > 2)
                : ['Follow the recipe instructions.'];

            return {
                id: 'api_' + meal.idMeal,
                apiId: meal.idMeal,
                title: meal.strMeal,
                category: meal.strCategory || 'Other',
                area: meal.strArea || '',
                image: meal.strMealThumb ? meal.strMealThumb + '/preview' : '',
                imageFull: meal.strMealThumb || '',
                rating: (Math.random() * 0.8 + 4.1).toFixed(1),
                time: Math.floor(Math.random() * 40 + 15) + ' min',
                servings: Math.floor(Math.random() * 4 + 2) + ' servings',
                difficulty: ['Easy', 'Medium', 'Medium'][Math.floor(Math.random() * 3)],
                calories: Math.floor(Math.random() * 400 + 200),
                description: meal.strInstructions ? meal.strInstructions.substring(0, 180) + '...' : '',
                ingredients: ingredients,
                steps: steps,
                youtube: meal.strYoutube || '',
                source: meal.strSource || '',
                tags: meal.strTags || '',
                nutrition: {
                    calories: Math.floor(Math.random() * 400 + 200),
                    protein: Math.floor(Math.random() * 30 + 10) + 'g',
                    carbs: Math.floor(Math.random() * 50 + 15) + 'g',
                    fat: Math.floor(Math.random() * 25 + 5) + 'g'
                }
            };
        }
    };

    // ==========================================
    // FAVORITES SYSTEM
    // ==========================================
    const Favorites = {
        KEY: 'favorites',
        getAll() { return Storage.get(this.KEY, []); },
        toggle(recipeId) {
            const favs = this.getAll();
            const idx = favs.indexOf(String(recipeId));
            if (idx > -1) { favs.splice(idx, 1); Toast.show('Removed from favorites'); }
            else { favs.push(String(recipeId)); Toast.show('Added to favorites ❤️', 'success'); }
            Storage.set(this.KEY, favs);
            this.updateUI();
            return idx === -1;
        },
        isFavorite(id) { return this.getAll().includes(String(id)); },
        updateUI() {
            $$('.favorite-btn[data-recipe-id]').forEach(btn => {
                const id = btn.dataset.recipeId;
                btn.classList.toggle('active', this.isFavorite(id));
                btn.setAttribute('aria-label', this.isFavorite(id) ? 'Remove from favorites' : 'Add to favorites');
            });
            this.renderFavoritesPage();
        },
        renderFavoritesPage() {
            const container = $('#favorites-container');
            if (!container) return;
            const favs = this.getAll();
            const empty = $('#favorites-empty');
            const count = $('#favorites-count');
            if (count) count.textContent = favs.length + ' recipe' + (favs.length !== 1 ? 's' : '');
            if (favs.length === 0) { container.innerHTML = ''; if (empty) empty.classList.remove('hidden'); return; }
            if (empty) empty.classList.add('hidden');
            const favRecipes = RecipeData.getAll().filter(r => favs.includes(String(r.id)));
            container.innerHTML = favRecipes.map(r => createLocalCardHTML(r, true)).join('');
            this.initButtons();
        },
        initButtons() {
            $$('.favorite-btn[data-recipe-id]').forEach(btn => {
                const n = btn.cloneNode(true);
                btn.parentNode.replaceChild(n, btn);
                n.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.toggle(n.dataset.recipeId); });
            });
        }
    };

    // ==========================================
    // SHARED CARD HTML GENERATORS
    // ==========================================
    function createLocalCardHTML(recipe, isFavPage) {
        const fav = Favorites.isFavorite(String(recipe.id));
        return '<article class="recipe-card" tabindex="0"><a href="recipe-detail.html?id=' + recipe.id + '" class="recipe-card-link" aria-label="' + recipe.title + '"><div class="recipe-card-image"><img src="' + recipe.image + '" alt="' + recipe.title + '" loading="lazy" width="400" height="300"><button class="favorite-btn ' + (fav ? 'active' : '') + '" data-recipe-id="' + recipe.id + '" aria-label="Favorite"><svg width="20" height="20" viewBox="0 0 24 24" fill="' + (fav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button></div><div class="recipe-card-body"><div class="recipe-meta"><span class="recipe-category">' + recipe.category + '</span><span class="recipe-rating">⭐ ' + recipe.rating + '</span></div><h3 class="recipe-card-title">' + recipe.title + '</h3><div class="recipe-info"><span>⏱️ ' + recipe.time + '</span><span>👤 ' + recipe.servings + '</span><span>🔥 ' + recipe.difficulty + '</span></div></div></a></article>';
    }

    function createAPICardHTML(recipe) {
        var badges = ['Trending', 'Popular', 'New', 'Online'];
        var cls = ['badge-trending', 'badge-popular', 'badge-new', 'badge-quick'];
        var r = Math.floor(Math.random() * 4);
        return '<article class="recipe-card" tabindex="0"><a href="#" class="recipe-card-link api-recipe-link" data-meal-id="' + recipe.apiId + '" aria-label="' + recipe.title + '"><div class="recipe-card-image"><img src="' + recipe.image + '" alt="' + recipe.title + '" loading="lazy" width="400" height="300" onerror="this.src=\'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop\'"><span class="recipe-badge ' + cls[r] + '">' + badges[r] + '</span></div><div class="recipe-card-body"><div class="recipe-meta"><span class="recipe-category">' + (recipe.area || recipe.category) + '</span><span class="recipe-rating">⭐ ' + recipe.rating + '</span></div><h3 class="recipe-card-title">' + recipe.title + '</h3><div class="recipe-info"><span>⏱️ ' + recipe.time + '</span><span>👤 ' + recipe.servings + '</span><span>🔥 ' + recipe.difficulty + '</span></div></div></a></article>';
    }

    // ==========================================
    // HEADER SCROLL SHADOW
    // ==========================================
    function initHeaderScroll() {
        var header = $('.header');
        if (!header) return;
        window.addEventListener('scroll', function () {
            requestAnimationFrame(function () { header.classList.toggle('scrolled', window.scrollY > 10); });
        }, { passive: true });
    }

    // ==========================================
    // MOBILE MENU
    // ==========================================
    function initMobileMenu() {
        var hamburger = $('#hamburger'), menu = $('#mobile-menu'), overlay = $('#mobile-overlay'), close = $('#mobile-close');
        if (!hamburger || !menu) return;
        function open() {
            hamburger.classList.add('active'); hamburger.setAttribute('aria-expanded', 'true');
            menu.classList.add('active'); menu.setAttribute('aria-hidden', 'false');
            if (overlay) { overlay.classList.add('active'); overlay.setAttribute('aria-hidden', 'false'); }
            document.body.style.overflow = 'hidden';
        }
        function shut() {
            hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active'); menu.setAttribute('aria-hidden', 'true');
            if (overlay) { overlay.classList.remove('active'); overlay.setAttribute('aria-hidden', 'true'); }
            document.body.style.overflow = '';
        }
        hamburger.addEventListener('click', function (e) { e.stopPropagation(); menu.classList.contains('active') ? shut() : open(); });
        if (close) close.addEventListener('click', shut);
        if (overlay) overlay.addEventListener('click', shut);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
        window.addEventListener('resize', debounce(function () { if (window.innerWidth >= 900) shut(); }, 200));
    }

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    function initCounterAnimation() {
        var counters = $$('[data-count]');
        if (!counters.length) return;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target, target = parseInt(el.dataset.count), start = performance.now();
                    function up(now) {
                        var p = Math.min((now - start) / 2000, 1);
                        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
                        if (p < 1) requestAnimationFrame(up); else el.textContent = target.toLocaleString();
                    }
                    requestAnimationFrame(up);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (c) { obs.observe(c); });
    }

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    function initScrollAnimations() {
        var els = $$('.recipe-card, .step-card, .category-grid-card, .team-card, .review-card');
        if (!els.length) return;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, i * 80);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        els.forEach(function (el) {
            el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            obs.observe(el);
        });
    }

    // ==========================================
    // NEWSLETTER FORM
    // ==========================================
    function initNewsletterForm() {
        var form = $('#newsletter-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = $('#newsletter-email'), err = $('#email-error'), ok = $('#email-success'), email = input.value.trim();
            if (err) err.textContent = ''; if (ok) ok.textContent = '';
            if (!email) { if (err) err.textContent = 'Please enter your email.'; return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { if (err) err.textContent = 'Enter a valid email.'; return; }
            var btn = $('button[type="submit"]', form); btn.textContent = 'Subscribing...'; btn.disabled = true;
            setTimeout(function () {
                if (ok) ok.textContent = '🎉 Successfully subscribed!';
                input.value = ''; btn.textContent = 'Subscribe'; btn.disabled = false;
                Toast.show('Welcome to RecipeHub! 🎉', 'success');
            }, 1200);
        });
    }

    // ==========================================
    // SEARCH — Local + TheMealDB API
    // ==========================================
    function initSearch() {
        var searchInput = $('#search-input'), searchResults = $('#search-results'),
            resultsCount = $('#results-count'), searchSuggestions = $('#search-suggestions'),
            resultsWrapper = $('#search-results-wrapper'), noResults = $('#no-results');

        if (!searchInput) return;

        // URL params
        var urlParams = new URLSearchParams(window.location.search);
        var q = urlParams.get('q');
        if (q) { searchInput.value = q; setTimeout(function () { performSearch(q); }, 200); }

        // Live search
        searchInput.addEventListener('input', debounce(function (e) { performSearch(e.target.value); }, 400));
        searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value); } });

        async function performSearch(query) {
            var q = query.trim();
            if (!q) {
                if (searchSuggestions) searchSuggestions.style.display = '';
                if (resultsWrapper) resultsWrapper.style.display = 'none';
                if (searchResults) searchResults.innerHTML = '';
                return;
            }

            if (searchSuggestions) searchSuggestions.style.display = 'none';
            if (resultsWrapper) resultsWrapper.style.display = '';
            if (noResults) noResults.style.display = 'none';

            // Loading
            if (searchResults) {
                searchResults.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;"><div style="font-size:2.5rem;margin-bottom:1rem;">🔍</div><p style="color:#737373;">Searching for "<strong>' + q + '</strong>"...</p></div>';
            }
            if (resultsCount) resultsCount.textContent = 'Searching...';

            // 1. Local search
            var localResults = RecipeData.search(q);

            // 2. API search with alternate spellings
            var apiResults = [];
            try {
                var apiMeals = await MealAPI.searchByName(q);

                // Try alternate spellings if no API results
                if (!apiMeals.length) {
                    var alts = {
                        'dosa': 'dosa', 'dosai': 'dosa', 'thosai': 'dosa',
                        'idli': 'idli', 'idly': 'idli',
                        'biriyani': 'biryani', 'briyani': 'biryani',
                        'sambhar': 'sambar', 'parotta': 'paratha',
                        'vadai': 'vada', 'chapathi': 'chapati',
                        'naan': 'naan', 'roti': 'chapati',
                        'paneer': 'paneer', 'dhal': 'dal',
                        'pulao': 'pilau', 'korma': 'korma'
                    };
                    var alt = alts[q.toLowerCase()];
                    if (alt && alt !== q.toLowerCase()) {
                        apiMeals = await MealAPI.searchByName(alt);
                    }
                }

                // Try first word if multi-word query
                if (!apiMeals.length && q.includes(' ')) {
                    apiMeals = await MealAPI.searchByName(q.split(' ')[0]);
                }

                apiResults = apiMeals.map(function (m) { return MealAPI.formatMeal(m); });
            } catch (err) { console.warn('API failed:', err); }

            // 3. Combine — remove duplicates
            var localTitles = localResults.map(function (r) { return r.title.toLowerCase(); });
            var uniqueAPI = apiResults.filter(function (r) { return !localTitles.includes(r.title.toLowerCase()); });
            var allResults = localResults.concat(uniqueAPI);

            // Update count
            if (resultsCount) {
                var note = uniqueAPI.length > 0 ? ' (' + localResults.length + ' local + ' + uniqueAPI.length + ' online)' : '';
                resultsCount.textContent = allResults.length + ' result' + (allResults.length !== 1 ? 's' : '') + ' for "' + q + '"' + note;
            }

            // No results
            if (allResults.length === 0) {
                if (searchResults) searchResults.innerHTML = '';
                if (noResults) noResults.style.display = '';
                return;
            }

            // Render
            var html = '';
            localResults.forEach(function (r) { html += createLocalCardHTML(r); });
            uniqueAPI.forEach(function (r) { html += createAPICardHTML(r); });

            if (searchResults) {
                searchResults.innerHTML = html;
                attachAPIClickHandlers();
                Favorites.initButtons();
                initScrollAnimations();
            }
        }

        // Suggestion tags
        $$('.suggestion-tag').forEach(function (tag) {
            tag.addEventListener('click', function () {
                var text = tag.textContent.replace(/^[^\w\s]+\s*/, '').trim();
                searchInput.value = text;
                performSearch(text);
                searchInput.focus();
            });
        });
    }

    // ==========================================
    // API RECIPE MODAL
    // ==========================================
    function attachAPIClickHandlers() {
        $$('.api-recipe-link').forEach(function (link) {
            link.addEventListener('click', async function (e) {
                e.preventDefault();
                var mealId = link.dataset.mealId;
                if (!mealId) return;
                Toast.show('Loading recipe...', 'default', 2000);
                var meal = await MealAPI.getById(mealId);
                if (!meal) { Toast.show('Could not load recipe', 'error'); return; }
                showRecipeModal(meal);
            });
        });
    }

    function showRecipeModal(meal) {
        var f = MealAPI.formatMeal(meal);
        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';

        var tagsHTML = '';
        if (meal.strTags) {
            tagsHTML = '<div class="flex gap-sm flex-wrap mb-md">' + meal.strTags.split(',').map(function (t) { return '<span class="suggestion-tag" style="cursor:default;font-size:0.7rem;">' + t.trim() + '</span>'; }).join('') + '</div>';
        }

        var buttonsHTML = '';
        if (meal.strYoutube) buttonsHTML += '<a href="' + meal.strYoutube + '" target="_blank" rel="noopener" class="btn btn-primary btn-sm">▶️ Watch Video</a>';
        if (meal.strSource) buttonsHTML += '<a href="' + meal.strSource + '" target="_blank" rel="noopener" class="btn btn-outline-dark btn-sm">🔗 Source</a>';

        var ingredientsHTML = f.ingredients.map(function (ing, i) {
            var imgTag = '';
            if (meal['strIngredient' + (i + 1)]) {
                imgTag = '<img src="https://www.themealdb.com/images/ingredients/' + meal['strIngredient' + (i + 1)] + '-Small.png" style="width:28px;height:28px;object-fit:contain;margin-left:auto;" onerror="this.style.display=\'none\'" alt="">';
            }
            return '<div class="ingredient-item" tabindex="0" style="cursor:pointer;" onclick="this.classList.toggle(\'checked\');var s=this.querySelector(\'svg\');if(s)s.style.display=this.classList.contains(\'checked\')?\'block\':\'none\';"><div class="ingredient-checkbox"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="display:none"><polyline points="20,6 9,17 4,12"/></svg></div><span>' + ing + '</span>' + imgTag + '</div>';
        }).join('');

        var stepsHTML = f.steps.map(function (step, i) {
            return '<div class="step-item"><div class="step-item-number">' + (i + 1) + '</div><p class="step-item-text">' + step + '</p></div>';
        }).join('');

        overlay.innerHTML = '<div class="modal" style="max-width:100%;max-height:92vh;"><div class="modal-handle"></div><button class="modal-close-btn" aria-label="Close" style="position:absolute;top:12px;right:12px;width:36px;height:36px;background:var(--gray-100);border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:10;font-size:1.25rem;cursor:pointer;border:none;color:var(--gray-600);">✕</button><div style="margin:calc(-1 * var(--space-lg));margin-bottom:0;"><img src="' + meal.strMealThumb + '" alt="' + meal.strMeal + '" style="width:100%;height:220px;object-fit:cover;border-radius:var(--radius-2xl) var(--radius-2xl) 0 0;" onerror="this.style.display=\'none\'"></div><div style="padding-top:var(--space-md);max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;"><div class="recipe-meta mb-sm"><span class="recipe-category">' + (meal.strArea || meal.strCategory) + '</span><span class="recipe-rating">⭐ ' + f.rating + '</span></div><h2 style="font-family:var(--font-display);font-size:1.375rem;margin-bottom:var(--space-sm);">' + meal.strMeal + '</h2><div class="recipe-detail-meta mb-lg"><span>🌍 ' + (meal.strArea || 'International') + '</span><span>📂 ' + (meal.strCategory || 'General') + '</span><span>⏱️ ' + f.time + '</span><span>👤 ' + f.servings + '</span></div>' + tagsHTML + '<div class="flex gap-sm mb-lg flex-wrap">' + buttonsHTML + '</div><div class="detail-section"><h3 class="detail-section-title">🥘 Ingredients</h3><div class="ingredients-list">' + ingredientsHTML + '</div></div><div class="detail-section"><h3 class="detail-section-title">📝 Instructions</h3><div class="steps-list">' + stepsHTML + '</div></div></div></div>';

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        var closeModal = function () { overlay.remove(); document.body.style.overflow = ''; };
        overlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
        document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', esc); } });
    }

    // ==========================================
    // RECIPE DETAIL PAGE
    // ==========================================
    function initRecipeDetail() {
        var container = $('#recipe-detail-container');
        if (!container) return;
        var urlParams = new URLSearchParams(window.location.search);
        var recipeId = urlParams.get('id');

        if (!recipeId) { container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><h2 class="empty-state-title">Recipe not found</h2><a href="recipes.html" class="btn btn-primary">Browse Recipes</a></div>'; return; }

        var recipe = RecipeData.getById(recipeId);
        if (!recipe) { container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><h2 class="empty-state-title">Recipe not found</h2><a href="recipes.html" class="btn btn-primary">Browse Recipes</a></div>'; return; }

        document.title = recipe.title + ' — RecipeHub';

        var ingredientsHTML = recipe.ingredients.map(function (ing) {
            return '<div class="ingredient-item" tabindex="0" style="cursor:pointer;" onclick="this.classList.toggle(\'checked\');var s=this.querySelector(\'svg\');if(s)s.style.display=this.classList.contains(\'checked\')?\'block\':\'none\';"><div class="ingredient-checkbox"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="display:none"><polyline points="20,6 9,17 4,12"/></svg></div><span>' + ing + '</span></div>';
        }).join('');

        var stepsHTML = recipe.steps.map(function (step, i) {
            return '<div class="step-item"><div class="step-item-number">' + (i + 1) + '</div><p class="step-item-text">' + step + '</p></div>';
        }).join('');

        container.innerHTML = '<div class="recipe-detail-hero"><img src="' + recipe.image.replace('w=400&h=300', 'w=800&h=500') + '" alt="' + recipe.title + '" class="recipe-detail-image" width="800" height="500"></div><div class="container"><div class="recipe-detail-content"><div class="recipe-meta mb-md"><span class="recipe-category">' + recipe.category + '</span><span class="recipe-rating">⭐ ' + recipe.rating + '</span></div><h1 class="recipe-detail-title">' + recipe.title + '</h1><p class="mb-lg" style="color:var(--gray-600);line-height:1.7;">' + recipe.description + '</p><div class="recipe-detail-meta mb-lg"><span>⏱️ ' + recipe.time + '</span><span>👤 ' + recipe.servings + '</span><span>🔥 ' + recipe.difficulty + '</span><span>🔋 ' + recipe.calories + ' cal</span></div><div class="flex gap-sm mb-xl flex-wrap"><button class="btn btn-primary fav-detail-btn" data-recipe-id="' + recipe.id + '">' + (Favorites.isFavorite(String(recipe.id)) ? '❤️ Saved' : '🤍 Save Recipe') + '</button><button class="btn btn-outline-dark" onclick="window.print()">🖨️ Print</button></div><div class="detail-section"><h2 class="detail-section-title">Nutrition</h2><div class="nutrition-grid"><div class="nutrition-item"><span class="nutrition-value">' + recipe.nutrition.calories + '</span><span class="nutrition-label">Calories</span></div><div class="nutrition-item"><span class="nutrition-value">' + recipe.nutrition.protein + '</span><span class="nutrition-label">Protein</span></div><div class="nutrition-item"><span class="nutrition-value">' + recipe.nutrition.carbs + '</span><span class="nutrition-label">Carbs</span></div><div class="nutrition-item"><span class="nutrition-value">' + recipe.nutrition.fat + '</span><span class="nutrition-label">Fat</span></div></div></div><div class="detail-section"><h2 class="detail-section-title">Ingredients</h2><div class="ingredients-list">' + ingredientsHTML + '</div></div><div class="detail-section"><h2 class="detail-section-title">Instructions</h2><div class="steps-list">' + stepsHTML + '</div></div></div></div>';

        var favBtn = $('.fav-detail-btn', container);
        if (favBtn) {
            favBtn.addEventListener('click', function () {
                var added = Favorites.toggle(String(favBtn.dataset.recipeId));
                favBtn.innerHTML = added ? '❤️ Saved' : '🤍 Save Recipe';
            });
        }
    }

   // ==========================================
// RECIPE FILTERS (Recipes Page)
// ==========================================
function initRecipeFilters() {
    var tabs = $$('.filter-tab'), container = $('#recipes-listing');
    if (!tabs.length || !container) return;

    function render(cat) {
        var recipes;
        
        // Handle special filter categories
        if (cat === 'all') {
            recipes = RecipeData.getAll();
        } else if (cat === 'breakfast') {
            recipes = RecipeData.getAll().filter(r => 
                r.category.toLowerCase() === 'breakfast' || 
                r.title.toLowerCase().includes('breakfast') ||
                r.title.toLowerCase().includes('idli') ||
                r.title.toLowerCase().includes('dosa') ||
                r.title.toLowerCase().includes('uttapam') ||
                r.title.toLowerCase().includes('pongal') ||
                r.title.toLowerCase().includes('smoothie') ||
                r.title.toLowerCase().includes('avocado toast')
            );
        } else if (cat === 'low-calorie') {
            recipes = RecipeData.getAll().filter(r => r.calories < 300);
        } else if (cat === 'quick') {
            recipes = RecipeData.getAll().filter(r => {
                var time = parseInt(r.time);
                return !isNaN(time) && time <= 30;
            });
        } else if (cat === 'vegetarian') {
            recipes = RecipeData.getAll().filter(r => 
                !r.title.toLowerCase().includes('chicken') &&
                !r.title.toLowerCase().includes('mutton') &&
                !r.title.toLowerCase().includes('shrimp') &&
                !r.title.toLowerCase().includes('salmon') &&
                r.category.toLowerCase() !== 'seafood'
            );
        } else {
            recipes = RecipeData.getByCategory(cat);
        }

        // Update count display
        var countEl = $('#recipes-count');
        if (countEl) {
            countEl.textContent = recipes.length + ' recipe' + (recipes.length !== 1 ? 's' : '');
        }

        if (recipes.length === 0) {
            container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><div class="empty-state-icon">🔍</div><h2 class="empty-state-title">No recipes found</h2><p>Try a different category</p></div>';
            return;
        }

        container.innerHTML = recipes.map(function (r) { return createLocalCardHTML(r); }).join('');
        Favorites.initButtons();
        initScrollAnimations();
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (t) { 
                t.classList.remove('active'); 
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            render(tab.dataset.category);
        });
    });

    // Initial render
    var activeTab = $('.filter-tab.active');
    if (activeTab) {
        render(activeTab.dataset.category);
    } else {
        render('all');
    }
}

// ==========================================
// SEARCH — Local + TheMealDB API (UPDATED)
// ==========================================
function initSearch() {
    var searchInput = $('#search-input'), searchResults = $('#search-results'),
        resultsCount = $('#results-count'), searchSuggestions = $('#search-suggestions'),
        resultsWrapper = $('#search-results-wrapper'), noResults = $('#no-results');

    if (!searchInput) return;

    // URL params
    var urlParams = new URLSearchParams(window.location.search);
    var q = urlParams.get('q');
    if (q) { searchInput.value = q; setTimeout(function () { performSearch(q); }, 200); }

    // Live search
    searchInput.addEventListener('input', debounce(function (e) { performSearch(e.target.value); }, 400));
    searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value); } });

    async function performSearch(query) {
        var q = query.trim();
        if (!q) {
            if (searchSuggestions) searchSuggestions.style.display = '';
            if (resultsWrapper) resultsWrapper.style.display = 'none';
            if (searchResults) searchResults.innerHTML = '';
            return;
        }

        if (searchSuggestions) searchSuggestions.style.display = 'none';
        if (resultsWrapper) resultsWrapper.style.display = '';
        if (noResults) noResults.style.display = 'none';

        // Loading
        if (searchResults) {
            searchResults.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;"><div style="font-size:2.5rem;margin-bottom:1rem;">🔍</div><p style="color:#737373;">Searching for "<strong>' + q + '</strong>"...</p></div>';
        }
        if (resultsCount) resultsCount.textContent = 'Searching...';

        // 1. Local search
        var localResults = RecipeData.search(q);

        // 2. API search with alternate spellings
        var apiResults = [];
        try {
            var apiMeals = await MealAPI.searchByName(q);

            // Try alternate spellings if no API results
            if (!apiMeals.length) {
                var alts = {
                    'dosa': 'dosa', 'dosai': 'dosa', 'thosai': 'dosa',
                    'idli': 'idli', 'idly': 'idli',
                    'biriyani': 'biryani', 'briyani': 'biryani',
                    'sambhar': 'sambar', 'parotta': 'paratha',
                    'vadai': 'vada', 'chapathi': 'chapati',
                    'naan': 'naan', 'roti': 'chapati',
                    'paneer': 'paneer', 'dhal': 'dal',
                    'pulao': 'pilau', 'korma': 'korma'
                };
                var alt = alts[q.toLowerCase()];
                if (alt && alt !== q.toLowerCase()) {
                    apiMeals = await MealAPI.searchByName(alt);
                }
            }

            // Try first word if multi-word query
            if (!apiMeals.length && q.includes(' ')) {
                apiMeals = await MealAPI.searchByName(q.split(' ')[0]);
            }

            apiResults = apiMeals.map(function (m) { return MealAPI.formatMeal(m); });
        } catch (err) { console.warn('API failed:', err); }

        // 3. Combine — remove duplicates
        var localTitles = localResults.map(function (r) { return r.title.toLowerCase(); });
        var uniqueAPI = apiResults.filter(function (r) { return !localTitles.includes(r.title.toLowerCase()); });
        var allResults = localResults.concat(uniqueAPI);

        // Update count
        if (resultsCount) {
            var note = uniqueAPI.length > 0 ? ' (' + localResults.length + ' local + ' + uniqueAPI.length + ' online)' : '';
            resultsCount.textContent = allResults.length + ' result' + (allResults.length !== 1 ? 's' : '') + ' for "' + q + '"' + note;
        }

        // No results
        if (allResults.length === 0) {
            if (searchResults) searchResults.innerHTML = '';
            if (noResults) noResults.style.display = '';
            return;
        }

        // Render
        var html = '';
        localResults.forEach(function (r) { html += createLocalCardHTML(r); });
        uniqueAPI.forEach(function (r) { html += createAPICardHTML(r); });

        if (searchResults) {
            searchResults.innerHTML = html;
            attachAPIClickHandlers();
            Favorites.initButtons();
            initScrollAnimations();
        }
    }

    // Suggestion tags - FIXED
    $$('.suggestion-tag').forEach(function (tag) {
        tag.addEventListener('click', function () {
            // Extract just the text, removing any emoji
            var text = tag.textContent.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
            searchInput.value = text;
            performSearch(text);
            searchInput.focus();
        });
    });
}

    // ==========================================
    // SHOPPING LIST
    // ==========================================
    function initShoppingList() {
        var container = $('#shopping-list-container');
        if (!container) return;

        function getList() {
            return Storage.get('shopping_list', [
                { id: 1, text: 'Olive oil', qty: '1 bottle', checked: false },
                { id: 2, text: 'Garlic', qty: '1 head', checked: false },
                { id: 3, text: 'Basmati rice', qty: '1 kg', checked: false },
                { id: 4, text: 'Onions', qty: '1 kg', checked: false },
                { id: 5, text: 'Tomatoes', qty: '500g', checked: false },
                { id: 6, text: 'Chicken', qty: '500g', checked: false },
                { id: 7, text: 'Coconut', qty: '2 pieces', checked: false },
                { id: 8, text: 'Curry leaves', qty: '1 bunch', checked: false }
            ]);
        }
        function save(list) { Storage.set('shopping_list', list); }

        function render() {
            var list = getList(), unchecked = list.filter(function (i) { return !i.checked; }),
                checked = list.filter(function (i) { return i.checked; });
            var countEl = $('#shopping-count');
            if (countEl) countEl.textContent = unchecked.length + ' item' + (unchecked.length !== 1 ? 's' : '') + ' remaining';
            var html = '';
            if (unchecked.length) {
                html += '<div class="shopping-section"><div class="shopping-section-title">To Buy <span class="shopping-section-count">' + unchecked.length + '</span></div>';
                unchecked.forEach(function (i) { html += itemHTML(i); }); html += '</div>';
            }
            if (checked.length) {
                html += '<div class="shopping-section"><div class="shopping-section-title">Done <span class="shopping-section-count">' + checked.length + '</span></div>';
                checked.forEach(function (i) { html += itemHTML(i); }); html += '</div>';
            }
            if (!list.length) html = '<div class="empty-state"><div class="empty-state-icon">🛒</div><h2 class="empty-state-title">Shopping list is empty</h2></div>';
            container.innerHTML = html;

            $$('.shopping-item', container).forEach(function (el) {
                el.addEventListener('click', function (e) {
                    if (e.target.closest('.shopping-item-delete')) return;
                    var id = parseFloat(el.dataset.id), list = getList(), item = list.find(function (i) { return i.id === id; });
                    if (item) { item.checked = !item.checked; save(list); render(); }
                });
            });
            $$('.shopping-item-delete', container).forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    save(getList().filter(function (i) { return i.id !== parseFloat(btn.dataset.id); }));
                    render(); Toast.show('Item removed');
                });
            });
        }

        function itemHTML(item) {
            return '<div class="shopping-item ' + (item.checked ? 'checked' : '') + '" data-id="' + item.id + '" tabindex="0"><div class="shopping-checkbox">' + (item.checked ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>' : '') + '</div><span class="shopping-item-text">' + item.text + '</span>' + (item.qty ? '<span class="shopping-item-qty">' + item.qty + '</span>' : '') + '<button class="shopping-item-delete" data-id="' + item.id + '" aria-label="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div>';
        }

        var addForm = $('#add-shopping-form');
        if (addForm) {
            addForm.addEventListener('submit', function (e) {
                e.preventDefault();
                var input = $('#add-shopping-input');
                if (!input.value.trim()) return;
                var list = getList();
                list.push({ id: Date.now(), text: input.value.trim(), qty: '', checked: false });
                save(list); input.value = ''; render();
                Toast.show('Item added! ✅', 'success');
            });
        }
        var clearBtn = $('#clear-completed');
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                save(getList().filter(function (i) { return !i.checked; }));
                render(); Toast.show('Completed items cleared');
            });
        }
        render();
    }

    // ==========================================
    // MEAL PLANNER
    // ==========================================
    function initMealPlanner() {
        var container = $('#planner-container');
        if (!container) return;
        var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        var meals = ['Breakfast', 'Lunch', 'Dinner'];
        var activeDay = 0;

        function getPlan() { return Storage.get('meal_plan', {}); }
        function savePlan(p) { Storage.set('meal_plan', p); }

        function render() {
            var plan = getPlan(), dayKey = days[activeDay].toLowerCase(), dayMeals = plan[dayKey] || {};
            container.innerHTML = meals.map(function (meal) {
                var mealKey = meal.toLowerCase();
                var recipe = dayMeals[mealKey] ? RecipeData.getById(dayMeals[mealKey]) : null;
                if (recipe) return '<div class="meal-slot filled" data-meal="' + mealKey + '"><div class="meal-slot-label">' + meal + '</div><div class="meal-slot-recipe"><img src="' + recipe.image + '" alt="' + recipe.title + '" width="60" height="60" style="border-radius:8px;object-fit:cover"><div class="meal-slot-recipe-info"><div class="meal-slot-recipe-title">' + recipe.title + '</div><div class="meal-slot-recipe-meta">' + recipe.time + ' · ' + recipe.calories + ' cal</div></div><button class="remove-meal-btn btn-icon" data-meal="' + mealKey + '" aria-label="Remove">✕</button></div></div>';
                return '<div class="meal-slot" data-meal="' + mealKey + '"><div class="meal-slot-label">' + meal + '</div><div class="meal-slot-add">+ Tap to add a recipe</div></div>';
            }).join('');

            $$('.meal-slot:not(.filled)', container).forEach(function (s) {
                s.addEventListener('click', function () { showPicker(s.dataset.meal); });
            });
            $$('.remove-meal-btn', container).forEach(function (b) {
                b.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var p = getPlan(), dk = days[activeDay].toLowerCase();
                    if (p[dk]) { delete p[dk][b.dataset.meal]; savePlan(p); render(); Toast.show('Meal removed'); }
                });
            });
        }

        function showPicker(mealType) {
            var recipes = RecipeData.getAll();
            var overlay = document.createElement('div');
            overlay.className = 'modal-overlay active';
            overlay.innerHTML = '<div class="modal"><div class="modal-handle"></div><h3 class="modal-title">Choose a Recipe</h3><div>' + recipes.map(function (r) {
                return '<div class="shopping-item" data-recipe-id="' + r.id + '" style="cursor:pointer"><img src="' + r.image + '" alt="" style="width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0" width="48" height="48"><div style="flex:1"><div style="font-weight:600;font-size:0.9rem">' + r.title + '</div><div style="font-size:0.75rem;color:var(--gray-500)">' + r.time + ' · ' + r.calories + ' cal</div></div></div>';
            }).join('') + '</div></div>';
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            overlay.addEventListener('click', function (e) { if (e.target === overlay) { overlay.remove(); document.body.style.overflow = ''; } });
            $$('.shopping-item[data-recipe-id]', overlay).forEach(function (item) {
                item.addEventListener('click', function () {
                    var p = getPlan(), dk = days[activeDay].toLowerCase();
                    if (!p[dk]) p[dk] = {};
                    p[dk][mealType] = parseInt(item.dataset.recipeId);
                    savePlan(p); overlay.remove(); document.body.style.overflow = '';
                    render(); Toast.show('Meal added! 📅', 'success');
                });
            });
        }

        $$('.day-tab').forEach(function (tab, i) {
            tab.addEventListener('click', function () {
                $$('.day-tab').forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');
                activeDay = i; render();
            });
        });
        render();
    }

    // ==========================================
    // SUBMIT RECIPE FORM
    // ==========================================
    function initSubmitForm() {
        var form = $('#submit-recipe-form');
        if (!form) return;

        var addIngBtn = $('#add-ingredient'), addStepBtn = $('#add-step');
        var ingList = $('#ingredients-fields'), stepList = $('#steps-fields');

        if (addIngBtn && ingList) {
            addIngBtn.addEventListener('click', function () {
                var item = document.createElement('div'); item.className = 'dynamic-list-item';
                item.innerHTML = '<input type="text" class="form-input ingredient-field" placeholder="e.g., 2 cups flour"><button type="button" class="remove-item-btn" aria-label="Remove">✕</button>';
                ingList.appendChild(item);
                item.querySelector('.remove-item-btn').addEventListener('click', function () { item.remove(); });
            });
        }
        if (addStepBtn && stepList) {
            addStepBtn.addEventListener('click', function () {
                var c = $$('.step-field', stepList).length + 1;
                var item = document.createElement('div'); item.className = 'dynamic-list-item';
                item.innerHTML = '<input type="text" class="form-input step-field" placeholder="Step ' + c + '"><button type="button" class="remove-item-btn" aria-label="Remove">✕</button>';
                stepList.appendChild(item);
                item.querySelector('.remove-item-btn').addEventListener('click', function () { item.remove(); });
            });
        }

        var uploadArea = $('#image-upload-area'), imageInput = $('#recipe-image-input'), imagePreview = $('#image-preview');
        if (uploadArea && imageInput) {
            uploadArea.addEventListener('click', function () { imageInput.click(); });
            imageInput.addEventListener('change', function () {
                if (imageInput.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        if (imagePreview) imagePreview.innerHTML = '<img src="' + e.target.result + '" alt="Preview" style="max-width:100%;border-radius:var(--radius-lg);">';
                        uploadArea.style.display = 'none';
                    };
                    reader.readAsDataURL(imageInput.files[0]);
                }
            });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;
            $$('.form-field-error', form).forEach(function (el) { el.classList.remove('visible'); el.textContent = ''; });
            $$('.form-input.error,.form-textarea.error,.form-select.error', form).forEach(function (el) { el.classList.remove('error'); });

            [{ id: 'recipe-title', label: 'Title' }, { id: 'recipe-description', label: 'Description' }, { id: 'recipe-category', label: 'Category' }, { id: 'recipe-prep-time', label: 'Prep time' }, { id: 'recipe-servings', label: 'Servings' }].forEach(function (f) {
                var input = $('#' + f.id, form);
                if (input && !input.value.trim()) {
                    valid = false; input.classList.add('error');
                    var err = $('#' + f.id + '-error', form);
                    if (err) { err.textContent = f.label + ' is required.'; err.classList.add('visible'); }
                }
            });
            if ($$('.ingredient-field', form).filter(function (f) { return f.value.trim(); }).length < 2) {
                valid = false; var e1 = $('#ingredients-error', form); if (e1) { e1.textContent = 'Add at least 2 ingredients.'; e1.classList.add('visible'); }
            }
            if ($$('.step-field', form).filter(function (f) { return f.value.trim(); }).length < 2) {
                valid = false; var e2 = $('#steps-error', form); if (e2) { e2.textContent = 'Add at least 2 steps.'; e2.classList.add('visible'); }
            }
            if (!valid) { Toast.show('Please fix errors above', 'error'); return; }

            var btn = $('button[type="submit"]', form); btn.textContent = 'Submitting...'; btn.disabled = true;
            setTimeout(function () {
                Toast.show('Recipe submitted! 🎉', 'success');
                form.reset(); btn.textContent = 'Submit Recipe'; btn.disabled = false;
                if (imagePreview) imagePreview.innerHTML = '';
                if (uploadArea) uploadArea.style.display = '';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        });
    }

    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    function initFAQ() {
        $$('.faq-item').forEach(function (item) {
            var q = $('.faq-question', item);
            if (!q) return;
            q.addEventListener('click', function () {
                var open = item.classList.contains('open');
                $$('.faq-item').forEach(function (i) { i.classList.remove('open'); });
                if (!open) item.classList.add('open');
            });
            q.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); } });
        });
    }

    // ==========================================
    // TABS
    // ==========================================
    function initTabs() {
        var btns = $$('.tab-btn'), contents = $$('.tab-content');
        if (!btns.length) return;
        btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                btns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                contents.forEach(function (c) { c.classList.remove('active'); if (c.id === btn.dataset.tab) c.classList.add('active'); });
            });
        });
    }

    // ==========================================
    // SLIDERS
    // ==========================================
    function initSliders() {
        $$('.slider-container').forEach(function (slider) {
            var track = $('.slider-track', slider), slides = $$('.slider-slide', slider),
                dots = $$('.slider-dot', slider), prev = $('.slider-prev', slider), next = $('.slider-next', slider);
            if (!track || !slides.length) return;
            var current = 0, interval;
            function goTo(i) {
                current = (i + slides.length) % slides.length;
                track.style.transform = 'translateX(-' + (current * 100) + '%)';
                dots.forEach(function (d, j) { d.classList.toggle('active', j === current); });
            }
            function auto() { interval = setInterval(function () { goTo(current + 1); }, 4000); }
            function stop() { clearInterval(interval); }
            if (prev) prev.addEventListener('click', function () { goTo(current - 1); stop(); auto(); });
            if (next) next.addEventListener('click', function () { goTo(current + 1); stop(); auto(); });
            dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); stop(); auto(); }); });
            var startX;
            track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stop(); }, { passive: true });
            track.addEventListener('touchend', function (e) {
                var diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
                auto();
            }, { passive: true });
            auto();
        });
    }

    // ==========================================
    // RATING STARS
    // ==========================================
    function initRatingStars() {
        $$('.rating-stars').forEach(function (c) {
            var stars = $$('.rating-star', c), sel = 0;
            stars.forEach(function (s, i) {
                s.addEventListener('click', function () { sel = i + 1; hi(sel); c.dataset.rating = sel; });
                s.addEventListener('mouseenter', function () { hi(i + 1); });
                s.addEventListener('keydown', function (e) { if (e.key === 'Enter') s.click(); });
            });
            c.addEventListener('mouseleave', function () { hi(sel); });
            function hi(n) { stars.forEach(function (s, i) { s.classList.toggle('filled', i < n); s.textContent = i < n ? '★' : '☆'; }); }
        });
    }

    // ==========================================
    // CONTACT FORM
    // ==========================================
    function initContactForm() {
        var form = $('#contact-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var n = $('#contact-name'), em = $('#contact-email'), m = $('#contact-message'), valid = true;
            $$('.form-input.error,.form-textarea.error', form).forEach(function (el) { el.classList.remove('error'); });
            if (n && !n.value.trim()) { n.classList.add('error'); valid = false; }
            if (em && (!em.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value))) { em.classList.add('error'); valid = false; }
            if (m && !m.value.trim()) { m.classList.add('error'); valid = false; }
            if (!valid) { Toast.show('Please fill all fields', 'error'); return; }
            var btn = $('button[type="submit"]', form); btn.textContent = 'Sending...'; btn.disabled = true;
            setTimeout(function () { Toast.show('Message sent! 📧', 'success'); form.reset(); btn.textContent = 'Send Message'; btn.disabled = false; }, 1200);
        });
    }

    // ==========================================
    // ACTIVE NAV
    // ==========================================
    function initActiveNav() {
        var file = window.location.pathname.split('/').pop() || 'index.html';
        $$('.bottom-nav-item, .mobile-menu-list a, .desktop-nav-list a').forEach(function (link) {
            link.classList.remove('active'); link.removeAttribute('aria-current');
            var href = link.getAttribute('href'), hf = href ? href.split('/').pop() : '';
            if (hf === file || (file === '' && hf === 'index.html')) {
                link.classList.add('active');
                if (link.closest('.bottom-nav')) link.setAttribute('aria-current', 'page');
            }
        });
    }

    // ==========================================
    // PROFILE PAGE
    // ==========================================
    function initProfile() {
        var el = $('#profile-fav-count');
        if (el) el.textContent = Favorites.getAll().length;
        var s = $('#profile-shopping-count');
        if (s) s.textContent = Storage.get('shopping_list', []).length;
    }

    // ==========================================
    // INIT EVERYTHING
    // ==========================================
    function init() {
        Toast.init();
        initHeaderScroll();
        initMobileMenu();
        initActiveNav();
        initCounterAnimation();
        initScrollAnimations();
        initNewsletterForm();
        initSearch();
        initRecipeDetail();
        initRecipeFilters();
        initShoppingList();
        initMealPlanner();
        initSubmitForm();
        initFAQ();
        initTabs();
        initSliders();
        initRatingStars();
        initProfile();
        initContactForm();
        Favorites.initButtons();
        Favorites.updateUI();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();