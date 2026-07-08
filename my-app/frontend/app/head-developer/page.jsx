"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box, Container, Typography, Grid, Chip, IconButton, Avatar, Button,
  Card, CardContent, Paper, useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, useInView, useMotionValue, useTransform, useSpring, animate } from "framer-motion";
import HomeLayout from "../layouts/HomeLayout/layout";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import CodeIcon from "@mui/icons-material/Code";
import DevicesIcon from "@mui/icons-material/Devices";
import SpeedIcon from "@mui/icons-material/Speed";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import SchoolIcon from "@mui/icons-material/School";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GroupIcon from "@mui/icons-material/Group";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TerminalIcon from "@mui/icons-material/Terminal";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TimelineIcon from "@mui/icons-material/Timeline";

const GlassCard = motion.create(
  styled(Card)({
    borderRadius: "20px",
    background: "var(--card-bg, rgba(255,255,255,0.85))",
    backdropFilter: "blur(12px)",
    border: "1px solid var(--card-border, rgba(255,255,255,0.7))",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    height: "100%",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    "&:hover": {
      boxShadow: "0 12px 40px rgba(14,165,233,0.12), 0 4px 20px rgba(0,0,0,0.08)",
      transform: "translateY(-4px)",
    },
  })
);

const ScrollReveal = ({ children, delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 40 : direction === "down" ? -40 : 0, x: direction === "left" ? -40 : direction === "right" ? 40 : 0 },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] } },
  };
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={variants}>
      {children}
    </motion.div>
  );
};

const SectionTitle = ({ label, title, subtitle, light }) => (
  <Box sx={{ textAlign: "center", mb: 6 }}>
    {label && (
      <Chip label={label} sx={{ bgcolor: light ? "rgba(255,255,255,0.1)" : "rgba(14,165,233,0.1)", color: light ? "#38BDF8" : "#0EA5E9", fontWeight: 700, mb: 2, borderRadius: "8px", px: 1.5, backdropFilter: "blur(4px)" }} />
    )}
    <Typography variant="h3" sx={{ fontWeight: 800, color: light ? "#fff" : "var(--text-primary, #0F172A)", mb: 1.5 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="h6" sx={{ color: light ? "rgba(255,255,255,0.7)" : "var(--text-secondary, #6B7280)", maxWidth: "600px", mx: "auto", fontWeight: 400, fontSize: "16px" }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const FloatingShape = ({ size, color, top, left, delay = 0 }) => (
  <motion.div
    style={{
      position: "absolute", top, left, width: size, height: size, borderRadius: "50%",
      background: color, pointerEvents: "none", opacity: 0.12,
    }}
    animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
    transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

function TypingText({ texts, className }) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    const timeout = deleting ? 40 : 80;
    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => { setDisplayed(current.slice(0, charIndex + 1)); setCharIndex((c) => c + 1); }, timeout);
      return () => clearTimeout(t);
    }
    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex > 0) {
      const t = setTimeout(() => { setDisplayed(current.slice(0, charIndex - 1)); setCharIndex((c) => c - 1); }, timeout);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }
  }, [charIndex, deleting, index, texts]);

  return (
    <span className={className}>
      {displayed}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
    </span>
  );
}

function SkillBar({ skill, level, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const width = useMotionValue(0);
  const springWidth = useSpring(width, { stiffness: 50, damping: 15 });

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => width.set(level), 300 + delay * 100);
      return () => clearTimeout(t);
    }
  }, [isInView, level, delay, width]);

  return (
    <Box ref={ref} sx={{ mb: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#fff" }}>{skill}</Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{level}%</Typography>
      </Box>
      <Box sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <motion.div style={{ width: springWidth, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #fff, rgba(255,255,255,0.5))" }} />
      </Box>
    </Box>
  );
}

function StatCounter({ value, label, icon, suffix = "+" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [isInView, value, count]);

  return (
    <GlassCard ref={ref} sx={{ textAlign: "center", py: 4, px: 2 }}>
      <Box sx={{ fontSize: 40, mb: 1.5, color: "#0EA5E9" }}>{icon}</Box>
      <Typography variant="h3" sx={{ fontWeight: 800, color: "var(--text-primary, #0F172A)", mb: 0.5 }}>
        <motion.span>{rounded}</motion.span>{suffix}
      </Typography>
      <Typography variant="body2" sx={{ color: "var(--text-secondary, #6B7280)", fontWeight: 500 }}>{label}</Typography>
    </GlassCard>
  );
}

export default function HeadDeveloper() {
  const isMobile = useMediaQuery("(max-width:600px)");

  const skills = [
    { skill: "HTML5", level: 95 }, { skill: "CSS3", level: 92 },
    { skill: "JavaScript", level: 88 }, { skill: "TypeScript", level: 75 },
    { skill: "React.js", level: 85 }, { skill: "Next.js", level: 80 },
    { skill: "Node.js", level: 78 }, { skill: "Express.js", level: 75 },
    { skill: "MongoDB", level: 72 }, { skill: "Git & GitHub", level: 85 },
    { skill: "Responsive Design", level: 90 }, { skill: "UI/UX Design", level: 82 },
    { skill: "REST APIs", level: 80 }, { skill: "Tailwind CSS", level: 88 },
    { skill: "Material UI", level: 85 },
  ];

  const techs = [
    { name: "HTML", icon: "🔤" }, { name: "CSS", icon: "🎨" },
    { name: "JavaScript", icon: "⚡" }, { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" }, { name: "Node.js", icon: "🟢" },
    { name: "MongoDB", icon: "🍃" }, { name: "GitHub", icon: "🐙" },
    { name: "VS Code", icon: "💻" }, { name: "Figma", icon: "🖌️" },
  ];

  const philosophy = [
    { icon: <CodeIcon />, title: "Clean Code", desc: "Writing readable, maintainable, and well-structured code that others can understand and build upon." },
    { icon: <DevicesIcon />, title: "Responsive Design", desc: "Creating seamless experiences across every device — from phones to desktops." },
    { icon: <SpeedIcon />, title: "Fast Performance", desc: "Optimizing every byte to deliver lightning-fast load times and smooth interactions." },
    { icon: <AccessibilityNewIcon />, title: "User-Friendly", desc: "Designing intuitive interfaces that anyone can use, regardless of technical background." },
    { icon: <SchoolIcon />, title: "Continuous Learning", desc: "Staying curious and constantly exploring new technologies and best practices." },
    { icon: <LightbulbIcon />, title: "Problem Solving", desc: "Breaking down complex challenges into elegant, practical solutions." },
    { icon: <GroupIcon />, title: "Teamwork", desc: "Collaborating effectively to build products that are greater than the sum of their parts." },
  ];

  const timeline = [
    { year: "Early Years", title: "Started Learning Computers", desc: "Developed a curiosity for how computers work, exploring basic software and hardware concepts." },
    { year: "2022", title: "Began Web Development", desc: "Started learning HTML and CSS, building simple static web pages and learning the fundamentals." },
    { year: "2023", title: "JavaScript & Beyond", desc: "Dove deep into JavaScript, learning DOM manipulation, async programming, and modern ES6+ features." },
    { year: "2024", title: "React & Next.js Journey", desc: "Started building single-page applications with React, then adopted Next.js for full-stack capabilities." },
    { year: "2025", title: "Built School Library Website", desc: "Developed a comprehensive library management system with catalog, reservations, user accounts, and admin panel." },
    { year: "Present", title: "Full-Stack Development", desc: "Continuing to master full-stack development with Node.js, Express, MongoDB, and modern frontend tools." },
  ];

  const achievements = [
    { icon: <RocketLaunchIcon />, title: "Modern Educational Websites", desc: "Developed modern, responsive web applications for schools, making education accessible in the digital age." },
    { icon: <DevicesIcon />, title: "Responsive Applications", desc: "Created web applications that work flawlessly across desktop, tablet, and mobile devices." },
    { icon: <SchoolIcon />, title: "Continuous Skill Growth", desc: "Dedicated to consistently improving programming skills through hands-on projects and self-learning." },
    { icon: <AutoAwesomeIcon />, title: "Open-Source Learning", desc: "Passionate about learning from open-source communities and contributing to shared knowledge." },
    { icon: <LightbulbIcon />, title: "Useful Digital Solutions", desc: "Focused on building practical digital tools that solve real problems for communities and schools." },
  ];

  const funFacts = [
    { icon: <NightlightRoundIcon />, title: "Night Coder", desc: "Does some of the best coding late at night when the world is quiet and focus is sharp." },
    { icon: <AutoAwesomeIcon />, title: "Tech Enthusiast", desc: "Always excited to explore new frameworks, tools, and technologies hitting the market." },
    { icon: <PsychologyIcon />, title: "UI/UX Passion", desc: "Believes great design is just as important as great code — form meets function." },
    { icon: <TerminalIcon />, title: "Problem Solver", desc: "Enjoys tackling coding challenges and puzzles, from algorithms to real-world bugs." },
    { icon: <RocketLaunchIcon />, title: "Future-Focused", desc: "Deeply interested in AI, modern web development trends, and the future of technology." },
  ];

  const stats = [
    { value: 25, label: "Projects Completed", icon: <RocketLaunchIcon /> },
    { value: 15, label: "Technologies Learned", icon: <AutoAwesomeIcon /> },
    { value: 3000, label: "Hours of Coding", icon: <CodeIcon /> },
    { value: 30, label: "GitHub Repositories", icon: <GitHubIcon /> },
    { value: 500, label: "Happy Users", icon: <FavoriteIcon /> },
  ];

  return (
    <HomeLayout>
      {/* ===== HERO ===== */}
      <Box sx={{
        position: "relative", minHeight: { xs: "80vh", md: "90vh" },
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 30%, #0F172A 60%, #1E293B 100%)",
        backgroundSize: "400% 400%",
        overflow: "hidden",
      }}>
        <motion.div style={{ position: "absolute", inset: 0 }} animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
        <FloatingShape size={300} color="#0EA5E9" top="-10%" left="-5%" delay={0} />
        <FloatingShape size={200} color="#8B5CF6" top="60%" right="-5%" delay={2} />
        <FloatingShape size={150} color="#0EA5E9" top="20%" right="20%" delay={4} />
        <FloatingShape size={180} color="#38BDF8" top="70%" left="10%" delay={1} />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center", py: 8 }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <Avatar src="/images/footer/kunuuu1122.png.jpg" alt="Kunjan Bhandari"
              sx={{ width: { xs: 140, md: 180 }, height: { xs: 140, md: 180 }, mx: "auto", mb: 3, border: "4px solid rgba(14,165,233,0.3)", boxShadow: "0 0 40px rgba(14,165,233,0.2)" }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: "#fff", mb: 1, fontSize: { xs: "2rem", md: "3rem" } }}>
              Kunjan Bhandari
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)", mb: 1, fontSize: { xs: "1rem", md: "1.25rem" }, minHeight: "2em" }}>
              <TypingText texts={["Head Developer & Website Creator", "Full-Stack Web Developer", "UI/UX Designer", "Tech Enthusiast"]} />
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap", mt: 2 }}>
              <Chip label="📍 Satyawati, Gulmi, Nepal" sx={{ color: "rgba(255,255,255,0.7)", borderRadius: "8px", bgcolor: "rgba(255,255,255,0.06)" }} />
              <Chip label="🎓 Diploma in Computer Engineering" sx={{ color: "rgba(255,255,255,0.7)", borderRadius: "8px", bgcolor: "rgba(255,255,255,0.06)" }} />
              <Chip label="🎂 17 Years" sx={{ color: "rgba(255,255,255,0.7)", borderRadius: "8px", bgcolor: "rgba(255,255,255,0.06)" }} />
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mt: 4 }}>
              <IconButton component="a" href="mailto:kunjanvhandari9@gmail.com" aria-label="Email"
                sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "#0EA5E9", transform: "translateY(-2px)" }, transition: "all 0.3s" }}>
                <EmailIcon />
              </IconButton>
              <IconButton component="a" href="https://github.com/kunjanbhandari" target="_blank" aria-label="GitHub"
                sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "#333", transform: "translateY(-2px)" }, transition: "all 0.3s" }}>
                <GitHubIcon />
              </IconButton>
              <IconButton component="a" href="https://www.linkedin.com/in/kunjan-bhandari" target="_blank" aria-label="LinkedIn"
                sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "#0A66C2", transform: "translateY(-2px)" }, transition: "all 0.3s" }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton component="a" href="https://www.facebook.com/kunjan.vhandari" target="_blank" aria-label="Facebook"
                sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "#1877F2", transform: "translateY(-2px)" }, transition: "all 0.3s" }}>
                <FacebookIcon />
              </IconButton>
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.1 }}>
            <Box sx={{ mt: 5 }}>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Typography sx={{ color: "rgba(255,255,255,0.3)" }}>↓</Typography>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ===== ABOUT ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "var(--bg-secondary)" }}>
        <Container maxWidth="md">
          <ScrollReveal>
            <SectionTitle label="About" title="Who I Am" subtitle="A passionate young developer building modern web experiences." />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <GlassCard sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="body1" sx={{ color: "var(--text-secondary, #475569)", lineHeight: 1.9, mb: 2, fontSize: "16px" }}>
                I am Kunjan Bhandari, a 17-year-old web developer from Satyawati-07, Juniya, Gulmi, Nepal. 
                Currently pursuing a Diploma in Computer Engineering, I have developed a deep passion for creating modern, 
                responsive, and user-friendly websites that make a real difference. My journey into programming started 
                with curiosity about how websites work, which quickly turned into a full-fledged commitment to mastering 
                the craft of web development.
              </Typography>
              <Typography variant="body1" sx={{ color: "var(--text-secondary, #475569)", lineHeight: 1.9, fontSize: "16px" }}>
                Over the past few years, I have gained hands-on experience with modern technologies like React, Next.js, 
                Node.js, and MongoDB. I enjoy solving real-world problems through clean code and thoughtful design. 
                Whether it is building a library management system for my school, designing intuitive UI components, 
                or learning a new framework, I approach every project with dedication and a desire to grow. 
                My goal is to continue building digital solutions that are accessible, performant, and visually engaging.
              </Typography>
            </GlassCard>
          </ScrollReveal>
        </Container>
      </Box>

      {/* ===== SKILLS ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#fff" }}>
        <Container maxWidth="md">
          <ScrollReveal>
            <SectionTitle label="Expertise" title="Skills & Proficiency" subtitle="Technologies and tools I work with daily." light />
          </ScrollReveal>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ScrollReveal>
                <Box sx={{ p: 3, bgcolor: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {skills.slice(0, 8).map((s, i) => (
                    <SkillBar key={s.skill} skill={s.skill} level={s.level} delay={i * 0.08} />
                  ))}
                </Box>
              </ScrollReveal>
            </Grid>
            <Grid item xs={12} md={6}>
              <ScrollReveal delay={0.2}>
                <Box sx={{ p: 3, bgcolor: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {skills.slice(8).map((s, i) => (
                    <SkillBar key={s.skill} skill={s.skill} level={s.level} delay={i * 0.08} />
                  ))}
                </Box>
              </ScrollReveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== TECHNOLOGIES ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "var(--bg-secondary)" }}>
        <Container maxWidth="md">
          <ScrollReveal>
            <SectionTitle label="Tech Stack" title="Technologies I Use" subtitle="My go-to tools and platforms for building modern applications." />
          </ScrollReveal>
          <Grid container spacing={2} justifyContent="center">
            {techs.map((tech, i) => (
              <Grid item xs={4} sm={3} md={2.4} key={tech.name}>
                <ScrollReveal delay={i * 0.05}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <GlassCard sx={{ textAlign: "center", py: 3, px: 1, cursor: "default" }}>
                      <Typography sx={{ fontSize: 32, mb: 0.5 }}>{tech.icon}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--text-primary, #0F172A)" }}>{tech.name}</Typography>
                    </GlassCard>
                  </motion.div>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== PHILOSOPHY ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#fff" }}>
        <Container maxWidth="lg">
          <ScrollReveal>
            <SectionTitle label="Philosophy" title="How I Build" subtitle="The principles that guide every project I work on." light />
          </ScrollReveal>
          <Grid container spacing={3}>
            {philosophy.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <ScrollReveal delay={i * 0.06}>
                  <motion.div whileHover={{ y: -4 }} style={{ height: "100%" }}>
                    <Box sx={{
                      p: 3, height: "100%", borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                      transition: "all 0.3s ease",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "rgba(14,165,233,0.3)" },
                    }}>
                      <Box sx={{ fontSize: 36, color: "#0EA5E9", mb: 1.5 }}>{item.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8 }}>{item.title}</Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{item.desc}</Typography>
                    </Box>
                  </motion.div>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== TIMELINE ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "var(--bg-secondary)" }}>
        <Container maxWidth="md">
          <ScrollReveal>
            <SectionTitle label="Journey" title="My Development Timeline" subtitle="The path from curious beginner to full-stack developer." />
          </ScrollReveal>
          <Box sx={{ position: "relative", pl: { xs: 3, md: 4 } }}>
            <Box sx={{ position: "absolute", left: { xs: 7, md: 12 }, top: 0, bottom: 0, width: 2, bgcolor: "var(--border-color, #E8E8E8)" }} />
            {timeline.map((item, i) => (
              <ScrollReveal key={item.year} delay={i * 0.1} direction="left">
                <Box sx={{ position: "relative", mb: 4, ml: { xs: 2, md: 4 } }}>
                  <Box sx={{ position: "absolute", left: { xs: -29, md: -36 }, top: 6, width: 16, height: 16, borderRadius: "50%", bgcolor: "#0EA5E9", border: "3px solid var(--bg-secondary, #fff)", boxShadow: "0 0 0 2px #0EA5E9" }} />
                  <GlassCard sx={{ p: 3 }}>
                    <Typography variant="caption" sx={{ color: "#0EA5E9", fontWeight: 700, letterSpacing: 1 }}>{item.year}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--text-primary, #0F172A)", mt: 0.3 }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-secondary, #6B7280)", mt: 0.5, lineHeight: 1.7 }}>{item.desc}</Typography>
                  </GlassCard>
                </Box>
              </ScrollReveal>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ===== ACHIEVEMENTS ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
        <Container maxWidth="lg">
          <ScrollReveal>
            <SectionTitle label="Milestones" title="Achievements" subtitle="What I have accomplished on my development journey so far." light />
          </ScrollReveal>
          <Grid container spacing={3}>
            {achievements.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <ScrollReveal delay={i * 0.08}>
                  <motion.div whileHover={{ y: -4 }} style={{ height: "100%" }}>
                    <Box sx={{
                      p: 3, height: "100%", borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "rgba(14,165,233,0.3)" },
                    }}>
                      <Box sx={{ fontSize: 40, color: "#38BDF8", mb: 1.5 }}>{item.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", mb: 0.8 }}>{item.title}</Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{item.desc}</Typography>
                    </Box>
                  </motion.div>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== FUN FACTS ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "var(--bg-secondary)" }}>
        <Container maxWidth="md">
          <ScrollReveal>
            <SectionTitle label="Fun Facts" title="Beyond the Code" subtitle="A little more about me outside of development." />
          </ScrollReveal>
          <Grid container spacing={3}>
            {funFacts.map((fact, i) => (
              <Grid item xs={12} sm={6} md={4} key={fact.title}>
                <ScrollReveal delay={i * 0.08}>
                  <GlassCard sx={{ textAlign: "center", py: 4, px: 2, cursor: "default" }}>
                    <Box sx={{ fontSize: 40, color: "#0EA5E9", mb: 1.5 }}>{fact.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--text-primary, #0F172A)", mb: 0.5 }}>{fact.title}</Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-secondary, #6B7280)", lineHeight: 1.7 }}>{fact.desc}</Typography>
                  </GlassCard>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== STATISTICS ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
        <Container maxWidth="lg">
          <ScrollReveal>
            <SectionTitle label="Numbers" title="By the Numbers" subtitle="A snapshot of my development journey in numbers." light />
          </ScrollReveal>
          <Grid container spacing={3}>
            {stats.map((stat, i) => (
              <Grid item xs={6} sm={4} md={2.4} key={stat.label}>
                <ScrollReveal delay={i * 0.08}>
                  <StatCounter value={stat.value} label={stat.label} icon={stat.icon} />
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== QUOTE ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "var(--bg-secondary)" }}>
        <Container maxWidth="md">
          <ScrollReveal>
            <GlassCard sx={{ p: { xs: 3, md: 5 }, textAlign: "center", position: "relative", overflow: "hidden" }}>
              <Typography sx={{ fontSize: 60, color: "#0EA5E9", opacity: 0.15, position: "absolute", top: 10, left: 20, lineHeight: 1 }}>"</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "var(--text-primary, #0F172A)", fontStyle: "italic", lineHeight: 1.6, maxWidth: "700px", mx: "auto", position: "relative", zIndex: 1 }}>
                Code is not just about making software work — it is about creating experiences that make people's lives easier.
              </Typography>
              <Typography sx={{ fontSize: 60, color: "#0EA5E9", opacity: 0.15, position: "absolute", bottom: 10, right: 20, lineHeight: 1 }}>"</Typography>
              <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
                <Avatar src="/images/footer/kunjan.jpg.jpg" sx={{ width: 40, height: 40 }} />
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "var(--text-primary, #0F172A)" }}>Kunjan Bhandari</Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-secondary, #888)" }}>Head Developer</Typography>
                </Box>
              </Box>
            </GlassCard>
          </ScrollReveal>
        </Container>
      </Box>

      {/* ===== CONTACT ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", textAlign: "center" }}>
        <Container maxWidth="sm">
          <ScrollReveal>
            <SectionTitle label="Connect" title="Let's Connect" subtitle="Have a project idea or just want to say hi? Reach out anytime." light />
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button component="a" href="mailto:kunjanvhandari9@gmail.com" variant="contained" startIcon={<EmailIcon />}
                sx={{ borderRadius: "12px", px: 3, py: 1.3, bgcolor: "rgba(255,255,255,0.1)", color: "#fff", backdropFilter: "blur(8px)", "&:hover": { bgcolor: "#0EA5E9" } }}>
                Email
              </Button>
              <Button component="a" href="https://github.com/kunjanbhandari" target="_blank" variant="contained" startIcon={<GitHubIcon />}
                sx={{ borderRadius: "12px", px: 3, py: 1.3, bgcolor: "rgba(255,255,255,0.1)", color: "#fff", backdropFilter: "blur(8px)", "&:hover": { bgcolor: "#333" } }}>
                GitHub
              </Button>
              <Button component="a" href="https://www.linkedin.com/in/kunjan-bhandari" target="_blank" variant="contained" startIcon={<LinkedInIcon />}
                sx={{ borderRadius: "12px", px: 3, py: 1.3, bgcolor: "rgba(255,255,255,0.1)", color: "#fff", backdropFilter: "blur(8px)", "&:hover": { bgcolor: "#0A66C2" } }}>
                LinkedIn
              </Button>
              <Button component="a" href="https://www.facebook.com/kunjan.vhandari" target="_blank" variant="contained" startIcon={<FacebookIcon />}
                sx={{ borderRadius: "12px", px: 3, py: 1.3, bgcolor: "rgba(255,255,255,0.1)", color: "#fff", backdropFilter: "blur(8px)", "&:hover": { bgcolor: "#1877F2" } }}>
                Facebook
              </Button>
            </Box>
          </ScrollReveal>
        </Container>
      </Box>
    </HomeLayout>
  );
}
