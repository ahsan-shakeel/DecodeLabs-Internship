// Digital Matchmaker - Client Engine & Interactive Visualizer
// Implements 4-step pipeline (Ingestion, Scoring, Sorting, Filtering)
// using custom TF-IDF and Cosine Similarity math.

const DATASET = [
    { role_id: 1, role_title: "Data Scientist", category: "Data & AI", required_skills: "Python, SQL, Machine Learning, Data Analysis, Statistics, Pandas, NumPy, Scikit-Learn", recommended_tools: "Jupyter, Pandas, TensorFlow, R", description: "Build statistical models and extract insights from complex structured and unstructured datasets.", popularity_score: 95 },
    { role_id: 2, role_title: "DevOps Engineer", category: "Infrastructure & DevOps", required_skills: "AWS, Docker, Kubernetes, CI/CD, Linux, Shell Scripting, Terraform, Git, Automation", recommended_tools: "Jenkins, GitLab CI, Ansible, Terraform", description: "Automate deployment pipelines and manage cloud infrastructure scalability and reliability.", popularity_score: 92 },
    { role_id: 3, role_title: "Backend Developer", category: "Software Engineering", required_skills: "Java, Python, SQL, REST APIs, PostgreSQL, Node.js, Spring Boot, Microservices, Redis", recommended_tools: "Postman, Docker, Git, IntelliJ", description: "Design and implement server-side business logic, databases, and microservices architecture.", popularity_score: 90 },
    { role_id: 4, role_title: "Cloud Architect", category: "Infrastructure & DevOps", required_skills: "Python, Cloud Computing, Automation, AWS, Azure, Terraform, Networking, System Design, Security", recommended_tools: "AWS Console, Terraform, Kubernetes, CloudFormation", description: "Design enterprise-wide cloud infrastructure solutions and security frameworks.", popularity_score: 88 },
    { role_id: 5, role_title: "Machine Learning Engineer", category: "Data & AI", required_skills: "Python, PyTorch, TensorFlow, Machine Learning, Deep Learning, MLOps, SQL, Data Engineering", recommended_tools: "Weights & Biases, MLflow, Docker, CUDA", description: "Deploy scalable AI and deep learning models into high-performance production systems.", popularity_score: 94 },
    { role_id: 6, role_title: "Frontend Developer", category: "Software Engineering", required_skills: "JavaScript, TypeScript, React, HTML, CSS, Next.js, Redux, Web Design, Tailwind CSS", recommended_tools: "VS Code, Webpack, Figma, Vite", description: "Craft responsive, dynamic user interfaces and engaging web experiences.", popularity_score: 91 },
    { role_id: 7, role_title: "Full Stack Developer", category: "Software Engineering", required_skills: "JavaScript, Node.js, React, Python, SQL, MongoDB, REST APIs, HTML, CSS, Git", recommended_tools: "VS Code, Docker, Postman, GitHub", description: "Develop both front-end client interfaces and back-end server infrastructure.", popularity_score: 96 },
    { role_id: 8, role_title: "Cybersecurity Analyst", category: "Security", required_skills: "Linux, Networking, Security, Penetration Testing, Python, SIEM, Cryptography, Risk Assessment", recommended_tools: "Wireshark, Metasploit, Burp Suite, Splunk", description: "Protect systems, networks, and data from cyber threats and vulnerability breaches.", popularity_score: 87 },
    { role_id: 9, role_title: "Data Engineer", category: "Data & AI", required_skills: "Python, SQL, Spark, Hadoop, Data Engineering, ETL, Airflow, Snowflake, Data Warehousing", recommended_tools: "Apache Spark, Airflow, dbt, Snowflake", description: "Build scalable data pipelines, data warehouses, and big data architecture.", popularity_score: 89 },
    { role_id: 10, role_title: "Site Reliability Engineer (SRE)", category: "Infrastructure & DevOps", required_skills: "Linux, Python, Kubernetes, Prometheus, Grafana, CI/CD, Terraform, Automation, Monitoring", recommended_tools: "Prometheus, Grafana, Kubernetes, PagerDuty", description: "Ensure high availability, resilience, and operational health of production systems.", popularity_score: 85 },
    { role_id: 11, role_title: "Mobile Developer (iOS/Android)", category: "Software Engineering", required_skills: "Swift, Kotlin, Mobile Development, React Native, Flutter, REST APIs, Git, UI Design", recommended_tools: "Xcode, Android Studio, Flutter SDK, Firebase", description: "Build mobile applications for iOS and Android platforms with smooth UX.", popularity_score: 86 },
    { role_id: 12, role_title: "Systems Administrator", category: "Infrastructure & DevOps", required_skills: "Linux, Windows Server, Networking, Bash, Automation, System Administration, Security, Active Directory", recommended_tools: "PowerShell, Bash, Nagios, Ansible", description: "Manage enterprise server environments, system health, user access, and network infrastructure.", popularity_score: 82 },
    { role_id: 13, role_title: "AI Research Scientist", category: "Data & AI", required_skills: "Python, PyTorch, Deep Learning, Mathematics, Algorithms, Computer Vision, NLP, Machine Learning", recommended_tools: "PyTorch, Jupyter, CUDA, LaTeX", description: "Conduct cutting-edge research in deep learning, neural networks, and generative AI.", popularity_score: 90 },
    { role_id: 14, role_title: "Database Administrator (DBA)", category: "Data & AI", required_skills: "SQL, PostgreSQL, MySQL, Oracle, Database Administration, Performance Tuning, Backup & Recovery, Linux", recommended_tools: "pgAdmin, MySQL Workbench, Oracle Manager", description: "Manage database performance, backup integrity, security policies, and high-availability clusters.", popularity_score: 80 },
    { role_id: 15, role_title: "UI/UX Engineer", category: "Software Engineering", required_skills: "Figma, Web Design, HTML, CSS, JavaScript, User Research, Prototyping, Wireframing", recommended_tools: "Figma, Adobe XD, Storybook, Tailwind", description: "Design intuitive user journeys, wireframes, and design systems for web and mobile apps.", popularity_score: 84 },
    { role_id: 16, role_title: "Security Engineer", category: "Security", required_skills: "Python, Security, Cryptography, Cloud Security, Network Security, Penetration Testing, Linux", recommended_tools: "Burp Suite, Nmap, Vault, AWS GuardDuty", description: "Architect robust security protocols, identity management, and application defense layers.", popularity_score: 88 },
    { role_id: 17, role_title: "QA Automation Engineer", category: "Software Engineering", required_skills: "Python, Java, Selenium, Cypress, Test Automation, CI/CD, Git, REST APIs", recommended_tools: "Selenium, Cypress, Postman, Jenkins", description: "Develop automated test suites and continuous integration checks to ensure software quality.", popularity_score: 81 },
    { role_id: 18, role_title: "Embedded Systems Engineer", category: "Software Engineering", required_skills: "C, C++, Microcontrollers, RTOS, Embedded Systems, Hardware, Linux, IoT", recommended_tools: "PlatformIO, Keil, STM32CubeMX, Arduino", description: "Program firmware and hardware-level software for IoT devices and microcontrollers.", popularity_score: 79 },
    { role_id: 19, role_title: "NLP Engineer", category: "Data & AI", required_skills: "Python, NLP, PyTorch, Transformers, Hugging Face, Machine Learning, Text Processing, SpaCy", recommended_tools: "Hugging Face, PyTorch, NLTK, SpaCy", description: "Develop natural language processing algorithms, LLM integrations, and sentiment analysis tools.", popularity_score: 89 },
    { role_id: 20, role_title: "Computer Vision Engineer", category: "Data & AI", required_skills: "Python, OpenCV, PyTorch, Computer Vision, Deep Learning, Image Processing, C++, CUDA", recommended_tools: "OpenCV, PyTorch, YOLO, TensorRT", description: "Engine computer vision models for image classification, object detection, and video analysis.", popularity_score: 88 },
    { role_id: 21, role_title: "MLOps Engineer", category: "Data & AI", required_skills: "Python, Docker, Kubernetes, MLflow, MLOps, CI/CD, Terraform, AWS, Machine Learning", recommended_tools: "MLflow, Kubeflow, Docker, AWS SageMaker", description: "Bridge the gap between ML research models and continuous production deployment pipelines.", popularity_score: 91 },
    { role_id: 22, role_title: "Blockchain Developer", category: "Software Engineering", required_skills: "Solidity, Ethereum, Smart Contracts, Web3, JavaScript, Rust, Cryptography, Blockchain", recommended_tools: "Hardhat, Truffle, Metamask, Remix IDE", description: "Develop decentralized applications (dApps) and secure smart contracts on blockchain networks.", popularity_score: 83 },
    { role_id: 23, role_title: "Solutions Architect", category: "Infrastructure & DevOps", required_skills: "Cloud Computing, System Design, AWS, Enterprise Architecture, Microservices, Security, Python", recommended_tools: "Lucidchart, AWS Console, Draw.io", description: "Design end-to-end technical blueprints and system architectures for business enterprises.", popularity_score: 87 },
    { role_id: 24, role_title: "Game Developer", category: "Software Engineering", required_skills: "C++, C#, Unity, Unreal Engine, Game Physics, 3D Modeling, Graphics Programming, Shader Programming", recommended_tools: "Unity, Unreal Engine, Blender, Visual Studio", description: "Build 2D and 3D video games, gameplay logic, physics engines, and interactive graphics.", popularity_score: 86 },
    { role_id: 25, role_title: "Network Security Engineer", category: "Security", required_skills: "Networking, Firewalls, Cisco, Security, VPN, Routing & Switching, Linux, Wireshark", recommended_tools: "Cisco Packet Tracer, Wireshark, pfSense", description: "Maintain secure corporate networks, firewalls, threat defense systems, and VPN connections.", popularity_score: 83 }
];

const POPULAR_SKILL_PRESETS = [
    "Python", "Cloud Computing", "Automation", "Machine Learning", "React",
    "Docker", "Kubernetes", "AWS", "SQL", "PyTorch", "JavaScript", "Linux",
    "Cybersecurity", "CI/CD", "Figma", "C++", "Java", "Terraform", "REST APIs"
];

class RecommendationEngine {
    constructor(dataset) {
        this.dataset = dataset;
        this.vocabulary = [];
        this.termToIndex = {};
        this.docFrequencies = {};
        this.idfVector = [];
        this.itemVectors = [];

        this.init();
    }

    normalizeToken(token) {
        return token.trim().toLowerCase();
    }

    extractTokens(text) {
        if (!text) return [];
        return text.split(/[,;/]+/).map(t => this.normalizeToken(t)).filter(t => t.length > 0);
    }

    init() {
        // Build vocabulary
        const vocabSet = new Set();
        this.dataset.forEach(item => {
            const tokens = this.extractTokens(item.required_skills);
            item.tokens = tokens;
            tokens.forEach(t => vocabSet.add(t));
        });

        this.vocabulary = Array.from(vocabSet).sort();
        this.vocabulary.forEach((term, idx) => {
            this.termToIndex[term] = idx;
        });

        const totalDocs = this.dataset.length;

        // Calculate Document Frequency (DF)
        this.docFrequencies = {};
        this.vocabulary.forEach(term => this.docFrequencies[term] = 0);

        this.dataset.forEach(item => {
            const uniqueTokens = new Set(item.tokens);
            uniqueTokens.forEach(token => {
                if (this.docFrequencies[token] !== undefined) {
                    this.docFrequencies[token]++;
                }
            });
        });

        // Calculate IDF = log(N / df)
        this.idfVector = new Array(this.vocabulary.length).fill(0);
        this.vocabulary.forEach((term, idx) => {
            const df = this.docFrequencies[term];
            if (df > 0) {
                this.idfVector[idx] = Math.log(totalDocs / df);
            }
        });

        // Compute Item TF-IDF vectors
        this.itemVectors = this.dataset.map(item => this.computeTfidfVector(item.tokens));
    }

    computeTfidfVector(tokens) {
        const vector = new Array(this.vocabulary.length).fill(0);
        if (!tokens || tokens.length === 0) return vector;

        const totalTerms = tokens.length;
        const counts = {};
        tokens.forEach(t => {
            counts[t] = (counts[t] || 0) + 1;
        });

        Object.keys(counts).forEach(term => {
            if (this.termToIndex[term] !== undefined) {
                const idx = this.termToIndex[term];
                const tf = counts[term] / totalTerms;
                const idf = this.idfVector[idx];
                vector[idx] = tf * idf;
            }
        });

        return vector;
    }

    cosineSimilarity(vecA, vecB) {
        let dot = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        if (normA === 0 || normB === 0) return 0;
        return dot / (normA * normB);
    }

    // 4-Step Pipeline: Ingestion -> Scoring -> Sorting -> Filtering
    recommend(userSkills, topN = 3, allowColdStartFallback = true) {
        // Step 1: Ingestion
        let tokens = [];
        userSkills.forEach(s => {
            tokens.push(...this.extractTokens(s));
        });

        const userVector = this.computeTfidfVector(tokens);
        const vectorSum = userVector.reduce((a, b) => a + b, 0);

        // Cold start check
        if (vectorSum === 0) {
            if (allowColdStartFallback) {
                return this.getTrendingFallback(topN, "Cold Start: No matching terms in vocabulary");
            }
        }

        // Step 2: Scoring
        const scored = this.dataset.map((item, idx) => {
            const score = this.cosineSimilarity(userVector, this.itemVectors[idx]);
            return { item, score };
        });

        // Step 3: Sorting
        scored.sort((a, b) => b.score - a.score);

        // Step 4: Filtering (Truncate to Top-N)
        return scored.slice(0, topN).map((res, index) => {
            const item = res.item;
            const matchedSkills = item.tokens.filter(t => tokens.includes(t));
            const missingSkills = item.tokens.filter(t => !tokens.includes(t));

            return {
                rank: index + 1,
                role_id: item.role_id,
                role_title: item.role_title,
                category: item.category,
                similarity_score: res.score,
                match_percentage: (res.score * 100).toFixed(1) + "%",
                required_skills: item.required_skills,
                recommended_tools: item.recommended_tools,
                description: item.description,
                matched_skills: matchedSkills,
                missing_skills: missingSkills,
                is_fallback: false
            };
        });
    }

    getTrendingFallback(topN, reason) {
        const sorted = [...this.dataset].sort((a, b) => b.popularity_score - a.popularity_score);
        return sorted.slice(0, topN).map((item, idx) => ({
            rank: idx + 1,
            role_id: item.role_id,
            role_title: item.role_title,
            category: item.category,
            similarity_score: 0,
            match_percentage: "Trending Fallback",
            required_skills: item.required_skills,
            recommended_tools: item.recommended_tools,
            description: item.description,
            matched_skills: [],
            missing_skills: item.tokens,
            is_fallback: true,
            fallback_reason: reason
        }));
    }

    getTfidfWeights(userSkills) {
        let tokens = [];
        userSkills.forEach(s => tokens.push(...this.extractTokens(s)));
        const vec = this.computeTfidfVector(tokens);

        const weights = [];
        vec.forEach((val, idx) => {
            if (val > 0) {
                weights.push({ term: this.vocabulary[idx], weight: val });
            }
        });

        return weights.sort((a, b) => b.weight - a.weight);
    }
}

// UI State Management
document.addEventListener("DOMContentLoaded", () => {
    const engine = new RecommendationEngine(DATASET);
    const selectedSkills = new Set();

    // DOM Elements
    const popularContainer = document.getElementById("popular-skills-container");
    const selectedTagsContainer = document.getElementById("selected-skills-tags");
    const skillsCountBadge = document.getElementById("min-skills-badge");
    const skillsCountNum = document.getElementById("skills-count-num");
    const customInput = document.getElementById("custom-skill-input");
    const addSkillBtn = document.getElementById("add-skill-btn");
    const clearSkillsBtn = document.getElementById("clear-skills-btn");
    const runBtn = document.getElementById("run-recommendation-btn");
    const coldStartToggle = document.getElementById("cold-start-toggle");
    const topNSelect = document.getElementById("top-n-select");
    const recommendationsContainer = document.getElementById("recommendations-container");
    const tfidfWeightsBars = document.getElementById("tfidf-weights-bars");
    const datasetTableBody = document.getElementById("dataset-table-body");
    const datasetRoleCount = document.getElementById("dataset-role-count");

    // Stepper Cards
    const stepCards = [
        document.getElementById("step-1-card"),
        document.getElementById("step-2-card"),
        document.getElementById("step-3-card"),
        document.getElementById("step-4-card")
    ];

    // Canvas Element
    const canvas = document.getElementById("vector-canvas");
    const ctx = canvas.getContext("2d");

    // Populate Popular Skills Pills
    POPULAR_SKILL_PRESETS.forEach(skill => {
        const pill = document.createElement("button");
        pill.className = "skill-pill";
        pill.innerText = skill;
        pill.addEventListener("click", () => toggleSkill(skill));
        popularContainer.appendChild(pill);
    });

    // Populate Dataset Table
    datasetRoleCount.innerText = DATASET.length;
    DATASET.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${row.role_id}</td>
            <td><strong>${row.role_title}</strong></td>
            <td><span class="category-tag">${row.category}</span></td>
            <td>${row.required_skills}</td>
            <td>${row.recommended_tools}</td>
            <td>${row.popularity_score}%</td>
        `;
        datasetTableBody.appendChild(tr);
    });

    function toggleSkill(skill) {
        if (selectedSkills.has(skill)) {
            selectedSkills.delete(skill);
        } else {
            selectedSkills.add(skill);
        }
        updateUI();
    }

    function addCustomSkill() {
        const val = customInput.value.trim();
        if (val) {
            val.split(/[,;/]+/).forEach(s => {
                const cleaned = s.trim();
                if (cleaned) selectedSkills.add(cleaned);
            });
            customInput.value = "";
            updateUI();
        }
    }

    addSkillBtn.addEventListener("click", addCustomSkill);
    customInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addCustomSkill();
    });

    clearSkillsBtn.addEventListener("click", () => {
        selectedSkills.clear();
        updateUI();
    });

    // Preset Buttons
    document.getElementById("preset-ai").addEventListener("click", () => {
        selectedSkills.clear();
        ["Python", "PyTorch", "Machine Learning", "Deep Learning", "TensorFlow"].forEach(s => selectedSkills.add(s));
        updateUI();
        triggerPipeline();
    });

    document.getElementById("preset-web").addEventListener("click", () => {
        selectedSkills.clear();
        ["JavaScript", "React", "Node.js", "HTML", "CSS", "TypeScript"].forEach(s => selectedSkills.add(s));
        updateUI();
        triggerPipeline();
    });

    document.getElementById("preset-sec").addEventListener("click", () => {
        selectedSkills.clear();
        ["Linux", "Networking", "Security", "Penetration Testing", "Python"].forEach(s => selectedSkills.add(s));
        updateUI();
        triggerPipeline();
    });

    function updateUI() {
        const count = selectedSkills.size;
        skillsCountNum.innerText = count;

        if (count >= 3) {
            skillsCountBadge.className = "status-badge status-success";
        } else {
            skillsCountBadge.className = "status-badge status-warning";
        }

        // Render selected tags
        selectedTagsContainer.innerHTML = "";
        if (count === 0) {
            selectedTagsContainer.innerHTML = `<span class="empty-placeholder">No skills selected yet. Select at least 3 skills above.</span>`;
        } else {
            selectedSkills.forEach(skill => {
                const tag = document.createElement("span");
                tag.className = "tag";
                tag.innerHTML = `${skill} <span class="tag-remove" data-skill="${skill}">×</span>`;
                tag.querySelector(".tag-remove").addEventListener("click", () => {
                    selectedSkills.delete(skill);
                    updateUI();
                });
                selectedTagsContainer.appendChild(tag);
            });
        }

        // Highlight active pills
        document.querySelectorAll(".skill-pill").forEach(pill => {
            if (selectedSkills.has(pill.innerText)) {
                pill.classList.add("selected");
            } else {
                pill.classList.remove("selected");
            }
        });
    }

    // Trigger Recommendation Pipeline with step animations
    function triggerPipeline() {
        const skillsArr = Array.from(selectedSkills);
        const topN = parseInt(topNSelect.value, 10);
        const allowColdStart = coldStartToggle.checked;

        // Step 1: Ingestion
        setStepActive(0);

        setTimeout(() => {
            // Step 2: Scoring
            setStepActive(1);
            const results = engine.recommend(skillsArr, topN, allowColdStart);

            setTimeout(() => {
                // Step 3: Sorting
                setStepActive(2);

                setTimeout(() => {
                    // Step 4: Filtering
                    setStepActive(3);
                    renderRecommendations(results);
                    renderTFIDFWeights(skillsArr);
                    renderCanvas(results, skillsArr);
                }, 150);
            }, 150);
        }, 150);
    }

    function setStepActive(stepIdx) {
        stepCards.forEach((card, idx) => {
            if (idx <= stepIdx) card.classList.add("active");
            else card.classList.remove("active");
        });
    }

    runBtn.addEventListener("click", triggerPipeline);
    topNSelect.addEventListener("change", triggerPipeline);

    function renderRecommendations(results) {
        recommendationsContainer.innerHTML = "";

        if (results.length === 0) {
            recommendationsContainer.innerHTML = `<div class="empty-placeholder">No matching recommendations found. Try enabling Cold Start Bypass.</div>`;
            return;
        }

        results.forEach(rec => {
            const card = document.createElement("div");
            card.className = `rec-card rank-${rec.rank}`;

            const matchedTagsHtml = rec.matched_skills.map(s => `<span class="skill-tag-matched">✓ ${s}</span>`).join(" ");
            const missingTagsHtml = rec.missing_skills.slice(0, 5).map(s => `<span class="skill-tag-missing">+ ${s}</span>`).join(" ");

            card.innerHTML = `
                <div class="rank-badge-box">
                    <div class="rank-number">#${rec.rank}</div>
                    <div class="rank-label">Rank</div>
                </div>
                <div class="rec-info">
                    <div class="rec-title-row">
                        <span class="rec-role-title">${rec.role_title}</span>
                        <span class="category-tag">${rec.category}</span>
                    </div>
                    <p class="rec-desc">${rec.description}</p>
                    <div class="skills-overlap-row">
                        ${matchedTagsHtml}
                        ${missingTagsHtml}
                    </div>
                </div>
                <div class="score-box">
                    <div class="score-value">${rec.match_percentage}</div>
                    <div class="score-label">${rec.is_fallback ? 'Fallback Mode' : 'Cosine Similarity'}</div>
                </div>
            `;
            recommendationsContainer.appendChild(card);
        });
    }

    function renderTFIDFWeights(skillsArr) {
        tfidfWeightsBars.innerHTML = "";
        const weights = engine.getTfidfWeights(skillsArr);

        if (weights.length === 0) {
            tfidfWeightsBars.innerHTML = `<span class="empty-placeholder">No vocabulary matches to calculate TF-IDF weights.</span>`;
            return;
        }

        const maxWeight = Math.max(...weights.map(w => w.weight));

        weights.forEach(item => {
            const pct = (item.weight / maxWeight) * 100;
            const row = document.createElement("div");
            row.className = "weight-row";
            row.innerHTML = `
                <div class="weight-label">${item.term}</div>
                <div class="weight-bar-bg">
                    <div class="weight-bar-fill" style="width: ${pct}%"></div>
                </div>
                <div class="weight-val">${item.weight.toFixed(3)}</div>
            `;
            tfidfWeightsBars.appendChild(row);
        });
    }

    // Realistic Math-Driven Cosine Vector Canvas Visualizer
    function renderCanvas(results, skillsArr) {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // Canvas Origin & Margins
        const originX = 70;
        const originY = height - 45;
        const maxRadius = Math.min(width - originX - 70, originY - 45);

        // Background Radial Grid & Unit Circle Arc
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        for (let r = 50; r <= maxRadius; r += 50) {
            ctx.beginPath();
            ctx.arc(originX, originY, r, 0, -Math.PI / 2, true);
            ctx.stroke();
        }

        // Unit Circle Arc (Reference Vector Space Boundary)
        ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(originX, originY, maxRadius, 0, -Math.PI / 2, true);
        ctx.stroke();
        ctx.setLineDash([]);

        // Degree Tick Marks (15deg, 30deg, 45deg, 60deg, 75deg)
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.font = "10px 'Fira Code', monospace";
        [15, 30, 45, 60, 75].forEach(deg => {
            const rad = (deg * Math.PI) / 180;
            const tx = originX + Math.cos(rad) * (maxRadius + 12);
            const ty = originY - Math.sin(rad) * (maxRadius + 12);
            ctx.fillText(`${deg}°`, tx - 6, ty + 3);
        });

        // Determine Top 2 Feature Dimensions (Skill Terms) for 2D Projection
        let tokens = [];
        skillsArr.forEach(s => tokens.push(...engine.extractTokens(s)));
        const userTfidf = engine.computeTfidfVector(tokens);

        // Sort terms by TF-IDF weight in user profile
        let termWeights = engine.vocabulary.map((term, idx) => ({
            term,
            idx,
            weight: userTfidf[idx]
        })).sort((a, b) => b.weight - a.weight);

        let dimX = termWeights[0] ? termWeights[0].idx : 0;
        let dimY = termWeights[1] && termWeights[1].weight > 0 ? termWeights[1].idx : (dimX + 1) % engine.vocabulary.length;

        const termX = engine.vocabulary[dimX] || "Feature X";
        const termY = engine.vocabulary[dimY] || "Feature Y";
        const weightX = userTfidf[dimX] || 0;
        const weightY = userTfidf[dimY] || 0;

        // Draw Axes with labels
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 2;

        // X Axis
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(width - 30, originY);
        ctx.stroke();

        // Y Axis
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX, 20);
        ctx.stroke();

        // Axis Labels with Real Skill Names & Weights
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 11px 'Fira Code', monospace";
        ctx.fillText(`Axis X: ${termX} (${weightX.toFixed(2)})`, width - 210, originY + 28);
        ctx.fillText(`Axis Y: ${termY} (${weightY.toFixed(2)})`, originX - 60, 15);

        // Calculate User Vector Coordinates
        const userNormX = weightX;
        const userNormY = weightY;

        let userVx, userVy, userAngleRad;
        if (userNormX === 0 && userNormY === 0) {
            userAngleRad = Math.PI / 4;
            userVx = originX + Math.cos(userAngleRad) * (maxRadius * 0.7);
            userVy = originY - Math.sin(userAngleRad) * (maxRadius * 0.7);
        } else {
            userAngleRad = Math.atan2(userNormY, userNormX);
            const userLen = 0.85;
            userVx = originX + Math.cos(userAngleRad) * (maxRadius * userLen);
            userVy = originY - Math.sin(userAngleRad) * (maxRadius * userLen);
        }

        // Draw User Vector Dashed Projection Lines to Axes
        ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(userVx, userVy);
        ctx.lineTo(userVx, originY);
        ctx.moveTo(userVx, userVy);
        ctx.lineTo(originX, userVy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw User Profile Vector Arrow (Cyan)
        drawArrow(ctx, originX, originY, userVx, userVy, "#06b6d4", 3, `User Vector (A)`);

        // Draw Candidate Vectors
        let topCandidateMath = null;

        if (results && results.length > 0 && !results[0].is_fallback) {
            const colors = ["#10b981", "#a855f7", "#f59e0b"];

            results.slice(0, 3).forEach((rec, idx) => {
                const item = engine.dataset.find(d => d.role_id === rec.role_id);
                const itemVec = engine.itemVectors[engine.dataset.indexOf(item)] || [];

                // Calculate angular position based on Cosine Similarity score
                const simScore = rec.similarity_score;
                // True N-dimensional angular separation angle theta in degrees
                const thetaRad = Math.acos(Math.min(1.0, Math.max(0.0, simScore)));
                const thetaDeg = (thetaRad * 180) / Math.PI;

                // Position on 2D plane: offset relative to user vector angle
                let candAngleRad = userAngleRad + (idx === 0 ? (thetaRad * 0.4) : (idx % 2 === 1 ? thetaRad * 0.7 : -thetaRad * 0.7));
                candAngleRad = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, candAngleRad));

                const candLen = 0.8;
                const candVx = originX + Math.cos(candAngleRad) * (maxRadius * candLen);
                const candVy = originY - Math.sin(candAngleRad) * (maxRadius * candLen);

                // Projection lines for candidate vector
                ctx.strokeStyle = colors[idx] + "55";
                ctx.setLineDash([2, 2]);
                ctx.beginPath();
                ctx.moveTo(candVx, candVy);
                ctx.lineTo(candVx, originY);
                ctx.stroke();
                ctx.setLineDash([]);

                // Draw Candidate Vector Arrow
                drawArrow(ctx, originX, originY, candVx, candVy, colors[idx], 2, `#${rec.rank} ${rec.role_title}`);

                // For Rank #1 match, draw Angle Arc and store breakdown math data
                if (idx === 0) {
                    const arcRadius = 60;
                    ctx.strokeStyle = "#f59e0b";
                    ctx.lineWidth = 1.8;
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    const startAngle = -userAngleRad;
                    const endAngle = -candAngleRad;
                    ctx.arc(originX, originY, arcRadius, startAngle, endAngle, userAngleRad < candAngleRad);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Label Theta Arc
                    const midAngle = (userAngleRad + candAngleRad) / 2;
                    const labelX = originX + Math.cos(midAngle) * (arcRadius + 18);
                    const labelY = originY - Math.sin(midAngle) * (arcRadius + 18);
                    ctx.fillStyle = "#f59e0b";
                    ctx.font = "bold 11px 'Fira Code', monospace";
                    ctx.fillText(`θ = ${thetaDeg.toFixed(1)}°`, labelX - 15, labelY);

                    // Compute Real Mathematical Dot Product and Norms across all vector space
                    let dotProd = 0, normA = 0, normB = 0;
                    userTfidf.forEach((a, i) => {
                        const b = itemVec[i] || 0;
                        dotProd += a * b;
                        normA += a * a;
                        normB += b * b;
                    });
                    normA = Math.sqrt(normA);
                    normB = Math.sqrt(normB);

                    topCandidateMath = {
                        roleTitle: rec.role_title,
                        dotProduct: dotProd.toFixed(4),
                        normUser: normA.toFixed(3),
                        normCand: normB.toFixed(3),
                        cosSim: simScore.toFixed(4),
                        matchPct: rec.match_percentage,
                        thetaDeg: thetaDeg.toFixed(1)
                    };
                }
            });
        }

        updateMathBreakdown(topCandidateMath);
    }

    function updateMathBreakdown(mathData) {
        const container = document.getElementById("vector-math-breakdown");
        if (!container) return;

        if (!mathData) {
            container.innerHTML = `<span class="empty-placeholder">Cold Start / Fallback Mode: Select at least 3 vocabulary skills to view real dot products & angular alignment.</span>`;
            return;
        }

        container.innerHTML = `
            <div class="math-card">
                <span class="math-label">Top Match</span>
                <span class="math-val highlight" style="font-size:0.85rem">${mathData.roleTitle}</span>
            </div>
            <div class="math-card">
                <span class="math-label">Dot Product (A · B)</span>
                <span class="math-formula">∑ (a_i × b_i)</span>
                <span class="math-val">${mathData.dotProduct}</span>
            </div>
            <div class="math-card">
                <span class="math-label">Vector Magnitudes</span>
                <span class="math-formula">||A|| & ||B||</span>
                <span class="math-val">${mathData.normUser} | ${mathData.normCand}</span>
            </div>
            <div class="math-card">
                <span class="math-label">Cosine Score</span>
                <span class="math-formula">cos(θ) = (A·B)/(||A||||B||)</span>
                <span class="math-val highlight">${mathData.cosSim} (${mathData.matchPct})</span>
            </div>
            <div class="math-card">
                <span class="math-label">Angular Gap (θ)</span>
                <span class="math-formula">arccos(cos θ)</span>
                <span class="math-val angle">${mathData.thetaDeg}°</span>
            </div>
        `;
    }

    function drawArrow(ctx, fromX, fromY, toX, toY, color, width, label) {
        const headlen = 10;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(toX, toY);
        ctx.fill();

        ctx.font = "500 11px 'Inter', sans-serif";
        ctx.fillText(label, toX + 8, toY - 5);
    }

    // Tabs switching
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
            if (btn.dataset.tab === "vector-space") {
                renderCanvas(engine.recommend(Array.from(selectedSkills), parseInt(topNSelect.value, 10)), Array.from(selectedSkills));
            }
        });
    });

    // Initial default state (AI/ML Specialist Preset)
    ["Python", "PyTorch", "Machine Learning", "Deep Learning", "TensorFlow"].forEach(s => selectedSkills.add(s));
    updateUI();
    triggerPipeline();
});
