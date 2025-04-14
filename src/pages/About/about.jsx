import React from 'react';
import { Anchor, Card, Button } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const AboutPage = () => {
  const navigate = useNavigate();

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Animation variants for cards
  const cardVariants = {
    rest: { scale: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    hover: { scale: 1.05, boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', transition: { duration: 0.3 } },
  };

  // Animation variants for buttons
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.2, type: 'spring', stiffness: 300 } },
  };

  function Section({ title, children }) {
    return (
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-[#1A202C] font-['Playfair_Display']">{title}</h3>
        <div className="text-[#2D3748] leading-relaxed">{children}</div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-screen font-['Inter'] bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f0ede3] shadow-2xs sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.div variants={buttonVariants} whileHover="hover">
              <Button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded px-4"
              >
                <ArrowLeftOutlined />
              </Button>
            </motion.div>
            <span
              className="text-[24px] font-bold text-[#333333] ml-10"
            style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              Travel TADA
            </span>
          </div>
          <div className="hidden md:block">
            <Anchor
              direction="horizontal"
              items={[
                { key: 'about', href: '#about', title: 'Giới thiệu' },
                { key: 'mission', href: '#mission', title: 'Tầm nhìn' },
                { key: 'history', href: '#history', title: 'Lịch sử' },
                { key: 'terms', href: '#terms', title: 'Điều khoản' },
                { key: 'help', href: '#help', title: 'Hỗ trợ' },
              ]}
              className="flex gap-6 text-sm [&>ul>li>a]:text-[#F8EDE3] [&>ul>li>a]:font-medium hover:[&>ul>li>a]:text-[#F687B3] transition-colors duration-200"
            />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* About Section */}
        <section id="about" className="mb-12 px-30">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 text-center text-[#009EE2] font-['Playfair_Display']"
          >
            Giới thiệu về Travel TADA
          </motion.h2>
          <motion.div
            variants={cardVariants}
            initial="rest"
            // whileHover="hover"
            className="bg-[#fffcfa] rounded-3xl p-6 shadow-lg "
          >
            <Section title="Nền tảng hiện đại">
              Travel TADA là nền tảng du lịch trực tuyến hiện đại, cung cấp đa dạng các tour du lịch trong và ngoài nước. Với giao diện thân thiện, dễ sử dụng, chúng tôi giúp khách hàng dễ dàng tìm kiếm, so sánh và đặt tour một cách nhanh chóng và tiện lợi.
            </Section>
            <Section title="Sứ mệnh">
              Sứ mệnh của chúng tôi là mang đến những trải nghiệm du lịch đáng nhớ, an toàn và đáng tin cậy cho mọi khách hàng. Chúng tôi không chỉ cung cấp tour mà còn đồng hành cùng bạn trong suốt hành trình – từ lúc lên kế hoạch đến khi kết thúc chuyến đi.
            </Section>
            <Section title="Đội ngũ chuyên nghiệp">
              Với đội ngũ nhân sự giàu kinh nghiệm, hệ thống hỗ trợ chuyên nghiệp và mạng lưới đối tác uy tín, Travel TADA cam kết mang đến dịch vụ chất lượng cao, đáp ứng đa dạng nhu cầu từ khách hàng cá nhân, nhóm bạn, gia đình cho đến doanh nghiệp.
            </Section>
            <Section title="Đồng hành cùng bạn">
              Hãy để Travel TADA là người bạn đồng hành đáng tin cậy trong mỗi chuyến đi của bạn!
            </Section>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="mb-12 px-30">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 text-center text-[#009EE2] font-['Playfair_Display']"
          >
            Tầm nhìn
          </motion.h2>
          <motion.div
            variants={cardVariants}
            initial="rest"
            // whileHover="hover"
            className="bg-[#fffcfa] rounded-3xl p-6 shadow-lg"
          >
            <Section title="Nền tảng hàng đầu">
              Tầm nhìn của Travel TADA là trở thành nền tảng du lịch hàng đầu tại Việt Nam, giúp khách hàng dễ dàng tiếp cận và trải nghiệm những tour du lịch đa dạng, chất lượng và đáng tin cậy.
            </Section>
            <Section title="Hệ sinh thái thông minh">
              Chúng tôi hướng đến việc xây dựng một hệ sinh thái du lịch thông minh, thân thiện và bền vững. Mỗi hành trình không chỉ là một chuyến đi mà còn là cơ hội để khám phá, học hỏi và kết nối với cộng đồng.
            </Section>
            <Section title="Đổi mới công nghệ">
              Travel TADA cam kết không ngừng đổi mới, ứng dụng công nghệ hiện đại để tối ưu hóa trải nghiệm người dùng, đồng thời bảo vệ môi trường và tôn trọng giá trị văn hóa bản địa.
            </Section>
            <Section title="Giá trị cốt lõi">
              Giá trị cốt lõi: <strong>Chất lượng</strong> – đảm bảo tiêu chuẩn cao nhất; <strong>Tận tâm</strong> – đặt khách hàng làm trung tâm; <strong>Đổi mới</strong> – cải tiến trải nghiệm; <strong>Bền vững</strong> – bảo vệ môi trường và cộng đồng.
            </Section>
          </motion.div>
        </section>

        {/* History Section */}
        <section id="history" className="mb-12 px-30">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 text-center text-[#009EE2] font-['Playfair_Display']"
          >
            Lịch sử
          </motion.h2>
          <motion.div
            variants={cardVariants}
            initial="rest"
            // whileHover="hover"
            className="bg-[#fffcfa] rounded-3xl p-6 shadow-lg"
          >
            <Section title="Thành lập 2021">
              Travel TADA được thành lập vào năm 2021, bắt đầu từ một nhóm sáng lập đam mê du lịch và công nghệ, mong muốn kết nối con người với thế giới qua những hành trình đáng nhớ.
            </Section>
            <Section title="Khởi nghiệp nhỏ">
              Những ngày đầu, chúng tôi là một dự án khởi nghiệp nhỏ, tập trung xây dựng nền tảng đặt tour trực tuyến đơn giản, minh bạch về thông tin và giá cả.
            </Section>
            <Section title="Phát triển vượt bậc">
              Đến năm 2023, Travel TADA đã hợp tác với hàng trăm đơn vị lữ hành, phục vụ hàng chục nghìn khách hàng mỗi năm, vượt qua thách thức từ thị trường và đại dịch.
            </Section>
            <Section title="Blog du lịch">
              Chúng tôi ra mắt blog du lịch, chia sẻ kinh nghiệm, mẹo du lịch, và câu chuyện từ các điểm đến, giúp khách hàng chuẩn bị tốt hơn cho chuyến đi.
            </Section>
          </motion.div>
        </section>

        {/* Terms Section */}
        <section id="terms" className="mb-12 px-30">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 text-center text-[#009EE2] font-['Playfair_Display']"
          >
            Điều khoản
          </motion.h2>
          <motion.div
            variants={cardVariants}
            initial="rest"
            // whileHover="hover"
            className="bg-[#fffcfa]  rounded-3xl p-6 shadow-lg"
          >
            <Section title="Chính sách bảo mật">
              Travel TADA cam kết bảo mật thông tin cá nhân, sử dụng mã hóa để bảo vệ dữ liệu thanh toán và lịch sử đặt tour. Khách hàng có quyền xem, chỉnh sửa hoặc xóa thông tin bất kỳ lúc nào.
            </Section>
            <Section title="Điều khoản sử dụng">
              Nội dung tour, giá cả có thể thay đổi tùy thời điểm. Khách hàng cần kiểm tra thông tin trước khi đặt, tuân thủ chính sách hủy/đổi của đối tác.
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Không sử dụng thông tin giả mạo.</li>
                <li>Không phá hoại hệ thống.</li>
                <li>Không sao chép nội dung chưa được phép.</li>
              </ul>
            </Section>
            <Section title="Chính sách hủy & hoàn tiền">
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Hủy trước 15 ngày: hoàn 100% (trừ phí giao dịch).</li>
                <li>Hủy trước 7 ngày: hoàn 50%.</li>
                <li>Hủy dưới 7 ngày: không hoàn tiền.</li>
              </ul>
              Tour hủy bởi Travel TADA được hoàn tiền đầy đủ hoặc đổi tour tương đương.
            </Section>
          </motion.div>
        </section>

        {/* Help Section */}
        <section id="help" className="mb-20 px-30">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 text-center text-[#009EE2] font-['Playfair_Display']"
          >
            Hỗ trợ
          </motion.h2>
          <motion.div
            variants={cardVariants}
            initial="rest"
            // whileHover="hover"
            className="bg-[#fffcfa]  rounded-3xl p-6 shadow-lg"
          >
            <Section title="Liên hệ 24/7">
              Đội ngũ hỗ trợ sẵn sàng phục vụ qua:
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>
                  Email:{' '}
                  <a href="mailto:support@traveltada.vn" className="text-[#2C7A7B] hover:text-[#F687B3]">
                    support@traveltada.vn
                  </a>
                </li>
                <li>
                  Hotline:{' '}
                  <a href="tel:19008888" className="text-[#2C7A7B] hover:text-[#F687B3]">
                    1900 8888
                  </a>
                </li>
                <li>Live chat trên nền tảng</li>
                <li>
                  Trung tâm trợ giúp:{' '}
                  <a href="/help" className="text-[#2C7A7B] hover:text-[#F687B3]">
                    traveltada.vn/help
                  </a>
                </li>
                <li>
                  Blog du lịch:{' '}
                  <a href="/blog" className="text-[#2C7A7B] hover:text-[#F687B3]">
                    traveltada.vn/blog
                  </a>
                </li>
              </ul>
            </Section>
            <Section title="Hỏi đáp (FAQ)">
              Truy cập{' '}
              <a href="/faq" className="text-[#2C7A7B] hover:text-[#F687B3]">
                traveltada.vn/faq
              </a>{' '}
              để giải đáp thắc mắc về đặt tour, hủy tour, hoặc mã giảm giá.
            </Section>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-[#f0ede3] text-black py-3"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 font-['Playfair_Display']">Về Travel TADA</h4>
              <p className="text-sm">
                Nền tảng du lịch trực tuyến mang đến những hành trình đáng nhớ, an toàn và tiện lợi.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 font-['Playfair_Display']">Chính sách</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/terms" className="hover:text-[#F687B3] transition">
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-[#F687B3] transition">
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="/refund" className="hover:text-[#F687B3] transition">
                    Chính sách hoàn hủy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 font-['Playfair_Display']">Liên hệ</h4>
              <p className="text-sm">Email: support@traveltada.vn</p>
              <p className="text-sm">Hotline: 1900 8888</p>
            </div>
          </div>
          <p className="text-sm">© 2025 Travel TADA. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default AboutPage;