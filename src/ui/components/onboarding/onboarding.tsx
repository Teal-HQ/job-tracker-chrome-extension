import React, { useRef, useState, useEffect } from 'react';
import { Carousel, Button, Input, Row, Col, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Onboarding = props => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const carouselRef = useRef<any>();
    const contentRef = useRef<any>();
    const [role, setRole] = useState('');
    const [location, setLocation] = useState('');

    const onCarouselChange = currentSlideNumber => {
        setCurrentSlide(currentSlideNumber);
    };

    const onNavPrev = () => {
        carouselRef.current.prev();
    };

    const onNavNext = () => {
        carouselRef.current.next();
    };

    useEffect(() => {
        if (contentRef) {
            // focus on carousel so that arrow navigation works as expected
            const slickTrackElement: any = document.querySelector('.slick-active');
            slickTrackElement && slickTrackElement.focus();
        }
    }, [contentRef]);

    const onRoleChange = e => {
        setRole(e.target.value);
    };

    const onLocationChange = e => {
        setLocation(e.target.value);
    };

    const onboardingSearchComplete = site => {
        chrome.storage.local.set({ onboardingSearchSite: site });
    };

    return (
        <div className="onboarding-container">
            <div className="nav-menu">
                {currentSlide !== 0 && (
                    <Button onClick={onNavPrev} className="nav-prev">
                        <LeftOutlined />
                    </Button>
                )}
                {currentSlide !== 3 && (
                    <Button onClick={onNavNext} className="nav-next">
                        <RightOutlined />
                    </Button>
                )}
            </div>
            <Carousel ref={carouselRef} afterChange={onCarouselChange}>
                <div ref={contentRef} className="onboarding-step">
                    {currentSlide === 0 && (
                        <div className="fade-in">
                            <img style={{ height: 200 }} src={chrome.runtime.getURL('images/onboarding-intro.svg')} alt="Introduction" />
                            <p>The Teal Job Saver is your companion to bookmark opportunities from job boards.</p>
                        </div>
                    )}
                </div>
                <div className="onboarding-step">
                    {currentSlide === 1 && (
                        <div className="fade-in">
                            <img src={chrome.runtime.getURL('images/onboarding-job-board.svg')} alt="Job board" />
                            <p>
                                From a job listing, <br /> click on
                                <img className="teal-logo" src={chrome.runtime.getURL('images/teal-logo.svg')} alt="Teal extension icon" />
                            </p>
                        </div>
                    )}
                </div>
                <div className="onboarding-step">
                    {currentSlide === 2 && (
                        <div className="fade-in">
                            <img style={{ height: 290 }} src={chrome.runtime.getURL('images/onboarding-save.svg')} alt="Saving job post" />
                            <p style={{ marginTop: 2 }}>And automatically grab the listing’s data and save it to your job tracker.</p>
                        </div>
                    )}
                </div>
                <div className="onboarding-step site-search">
                    {currentSlide === 3 && (
                        <div className="fade-in">
                            <p>Try it now on some of your favorite job boards!</p>

                            <Input onChange={onRoleChange} placeholder="Product Manager" />
                            <Input onChange={onLocationChange} placeholder="New York, NY" />

                            <Row className={(!role || !location) && 'search-disabled'} gutter={20} justify="space-around">
                                <Col span={6}>
                                    <Tooltip title="LinkedIn">
                                        <a
                                            onClick={e => onboardingSearchComplete('linkedin')}
                                            target="_blank"
                                            href={`https://www.linkedin.com/jobs/search/?keywords=${role}&location=${location}`}
                                        >
                                            <img src={chrome.runtime.getURL('images/linkedin.png')} alt="LinkedIn search" />
                                        </a>
                                    </Tooltip>
                                </Col>
                                <Col span={6}>
                                    <Tooltip title="Indeed">
                                        <a
                                            onClick={e => onboardingSearchComplete('indeed')}
                                            target="_blank"
                                            href={`https://www.indeed.com/jobs?q=${role}&l=${location}`}
                                        >
                                            <img src={chrome.runtime.getURL('images/indeed.png')} alt="Indeed search" />
                                        </a>
                                    </Tooltip>
                                </Col>
                                <Col span={6}>
                                    <Tooltip title="Monster.com">
                                        <a
                                            onClick={e => onboardingSearchComplete('monster')}
                                            target="_blank"
                                            href={`https://www.monster.com/jobs/search?q=${role}&where=${location}`}
                                        >
                                            <img src={chrome.runtime.getURL('images/monster.png')} alt="Monster search" />
                                        </a>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>
            </Carousel>
        </div>
    );
};

export default Onboarding;
