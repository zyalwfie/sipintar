import React from 'react';
import { FiCheckCircle, FiDollarSign, FiFileText, FiUsers } from 'react-icons/fi';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import TableOne from '../../components/Tables/TableOne';

const ECommerce: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Pengadaan" total="5" rate="Bulan ini" levelUp>
          <FiFileText className="text-primary dark:text-white" size={22} />
        </CardDataStats>

        <CardDataStats title="Total Nilai HPS" total="Rp 825,8 jt" rate="8.2%" levelUp>
          <FiDollarSign className="text-primary dark:text-white" size={22} />
        </CardDataStats>

        <CardDataStats title="Pengadaan Lengkap" total="3" rate="60%" levelUp>
          <FiCheckCircle className="text-primary dark:text-white" size={22} />
        </CardDataStats>

        <CardDataStats title="Penyedia Terdata" total="5" rate="2 baru" levelUp>
          <FiUsers className="text-primary dark:text-white" size={22} />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <div className="col-span-12">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
