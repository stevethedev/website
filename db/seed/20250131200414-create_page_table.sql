CREATE TABLE IF NOT EXISTS page
(
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    path       VARCHAR(255) NOT NULL,
    content    TEXT         NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO page (title, path, content)
VALUES ('Home', '/', '
## The Programmer

_The Software Handyman_

Programmers are often in the early stages of their careers. A programmer will
be able to take an individual task and convert it into code. They may be
self-taught, and they may not be especially concerned with planning or
best-practices. As a result, the code that a programmer writes may be buggy
or difficult to integrate with a large project. With mentoring, study, and
experience, programmers can become invaluable members of their teams; but
good programmers rarely stay at this level forever.

## The Software Engineer

_Weeks of coding can save you hours of planning_

A Software Engineer is a programmer who has enough experience and expertise to
understand the benefits of planning. Instead of jumping right into a project
and pumping out code, they take time to understand your requirements, consider
the correctness of their solution, and produce high-quality results. They will
take a little longer to get started than a Programmer, but the quality difference
is worth the wait.

## The Software Architect

_If you are failing to plan, then you are planning to fail_

Having a Software Architect on staff means that you have someone who cares about
the long-term success of your project. A Software Architect is able to examine
your project''s requirements and create a plan to turn your vision into a reality.
An Architect may do this with written documents, diagrams, and charts; and is
responsible for making sure that the development team is _set-up for success_.
A good Software Architect helps prevent mismatches between Software Engineers,
resulting in a more coherent and maintainable project. Their code will work
because the project was designed to work.
'),
       ('About', '/about', '
# About Steve the Dev

Hi! I''m Steven Jimenez, the main author (and right now, the only author) here
at Steve the Dev. I''m an experienced Software Engineer and early Software
Architect with years of professional and amateur experience in several
different languages and environments.

## Early Experience

I first started programming as an early teenager, when my Mom brought home an
old Windows 3.1 computer with QuickBasic installed. In the late 90''s, this
wasn''t especially useful for much besides practicing programming, and I
quickly learned that I had a strong interest and aptitude for development.
After a couple of years, I bought a newer computer and started branching out
into various other languages to pursue various pet projects. One project,
written in C# and which enjoyed some limited notoriety in the Civilization
IV modding community under the name
[Esemjay''s KonverterFM](https://forums.civfanatics.com/threads/esemjays-kfm-converter.263215/),
and was featured in
[Apolyton''s ModCasts Season 1 Episode 04](http://civcomm.civfanatics.com/polycast/modcast/season1.php#episode04).
Between my work on KonverterFM, its unreleased cousin C++ command-line
utility, and the tons of fun I had with learning how to program in many
other languages and contexts, I was hooked.

## In the Military

Once I joined the Air Force, I started applying the skills I accrued as a
hobbyist to automate the tedious parts of my job. The most notable project I
developed from my time in the military was a system to track the analysts,
aircrews, missions flown, and intelligence gathered on those missions. Written
in Visual Basic, the software supported around was capable of converting
coordinates between the Geodetic and MGRS systems, provided collaborative
note-taking between users, and integrated with Google Earth through imported
and exported KML files.

## Since the Military

After leaving the military, I worked for a year as a government contractor at
United States Southern Command Headquarters, where I worked with the IT
division of the Intelligence Directorate to automate tasks for analysts and
managers. My main accomplishment in this project was a budgeting software which
standardized processes and automated communication throughout the organization.
This ensured that top-level financial managers were able to more accurately
track money as it was spent, generated reports for meetings, and drastically
reduced the amount of time spent exchanging emails and writing reports. At this
same organization, I worked as a professional tester; where I helped to write
automated tests to validate [iSpatial](http://www.t-sciences.com/product/ispatial)
from Thermopylae Sciences and Technologies.

I also worked as a web developer in North Carolina, where I was responsible for
planning and leading projects. I performed the requirements-gathering, architecting,
development, and testing of the API that powers the
[Arts Everywhere Mobile App](https://uncnews.unc.edu/2018/01/22/arts-everywhere-launches-app/).
In another project, I was the architect and primary developer behind a cluster of
small applications which transfer orders, products, prices, inventory, customers, and
other information between a Magento 2 site and a pre-existing (and custom-built)
Oracle API.

## Other Experiences

In addition to my work as a software developer and software architect — both as
a professional and hobbyist — I also hold a lot of niche experience that gives me
a unique perspective when approaching problems.

I was assigned as an Intelligence Analyst to Air Force Special Operations
Command, where I had the opportunity to work with Special Operators from
the Navy, Marines, Army, and Air Force; as well as foreign special operators
from NATO countries. In these years, I was able to pursue everything from
reconnaissance missions to hostage-rescue operations; and I derived a lot of
personal satisfaction from this job. The experiences I accrued while working
for years in a high-stakes environment with a low tolerance for failure has
given me a strong appreciation for the value of practice and precision. I try
to bring an attitude of excellence to whatever project I work on, and I enjoy
looking back on a completed project to see what I can do better on the next
project — I take pride in my work, but I do not put my ego into it.

In my time with US Southern Command, I needed to be able to communicate
effectively with people who had very little experience with programming in
order to extract technical requirements. This meant that I had to be able
to extract actionable requirements from rooms full of people — many of whom
would openly and vehemently disagree over the particulars of how a system
should function. To be effective with this job, I had to learn how to
resolve disputes, propose compromises, and distill requirements from
groups of people politely and professionally. I also had to be
comfortable talking in front of crowds and strangers to teach people how
to use software and to report negative feedback from users in a way that
accurately conveys the feedback but avoids the panic of executives.
');
